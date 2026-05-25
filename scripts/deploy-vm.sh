#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "This deploy script is intended for Linux VMs."
  exit 1
fi

if ! command -v sudo >/dev/null 2>&1 && [[ "${EUID}" -ne 0 ]]; then
  echo "sudo is required when not running as root."
  exit 1
fi

run_root() {
  if [[ "${EUID}" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

install_docker_if_needed() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    echo "Docker and Docker Compose are already installed."
    return
  fi

  if ! command -v apt-get >/dev/null 2>&1; then
    echo "Automatic install is supported only for apt-based systems."
    echo "Install Docker manually, then rerun this script."
    exit 1
  fi

  export DEBIAN_FRONTEND=noninteractive

  run_root apt-get update
  run_root apt-get install -y ca-certificates curl gnupg
  run_root install -m 0755 -d /etc/apt/keyrings

  if [[ ! -f /etc/apt/keyrings/docker.asc ]]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | run_root gpg --dearmor -o /etc/apt/keyrings/docker.asc
    run_root chmod a+r /etc/apt/keyrings/docker.asc
  fi

  local arch
  local codename
  local distro_id
  arch="$(dpkg --print-architecture)"
  codename="$(
    . /etc/os-release
    echo "${VERSION_CODENAME:-stable}"
  )"
  distro_id="$(
    . /etc/os-release
    echo "${ID}"
  )"

  if [[ "$distro_id" != "ubuntu" && "$distro_id" != "debian" ]]; then
    echo "Automatic Docker installation is supported only for Ubuntu and Debian."
    exit 1
  fi

  echo \
    "deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${distro_id} ${codename} stable" \
    | run_root tee /etc/apt/sources.list.d/docker.list >/dev/null

  run_root apt-get update
  run_root apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  run_root systemctl enable --now docker

  if [[ "${EUID}" -ne 0 ]]; then
    run_root usermod -aG docker "$USER" || true
  fi
}

ensure_env_file() {
  if [[ ! -f .env ]]; then
    cp .env.example .env
  fi

  if grep -q '^ADMIN_TOKEN=potencore-admin-dev-token$' .env; then
    local token
    if command -v openssl >/dev/null 2>&1; then
      token="$(openssl rand -hex 24)"
    else
      token="potencore-admin-$(date +%s)"
    fi

    if command -v python3 >/dev/null 2>&1; then
      python3 - <<'PY'
from pathlib import Path
import os

env_path = Path(".env")
content = env_path.read_text(encoding="utf-8")
content = content.replace("ADMIN_TOKEN=potencore-admin-dev-token", f"ADMIN_TOKEN={os.environ['POTENCORE_ADMIN_TOKEN']}")
env_path.write_text(content, encoding="utf-8")
PY
    else
      run_root sed -i.bak "s/^ADMIN_TOKEN=.*/ADMIN_TOKEN=${token}/" .env
      rm -f .env.bak
    fi
  fi
}

print_summary() {
  echo
  echo "PotenCore is starting."
  echo "Site: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'VM_IP')"
  echo "Admin URL: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'VM_IP')/admin"
  echo "Default admin login: admin"
  echo "Default admin password: admin"
  echo
  echo "If you change the password/token, edit .env and rerun:"
  echo "docker compose up -d --build"
}

install_docker_if_needed

if [[ ! -x /usr/bin/docker && ! -x /usr/local/bin/docker ]] && ! command -v docker >/dev/null 2>&1; then
  echo "Docker installation failed."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin is not available."
  exit 1
fi

POTENCORE_ADMIN_TOKEN=""
if grep -q '^ADMIN_TOKEN=potencore-admin-dev-token$' .env.example; then
  if command -v openssl >/dev/null 2>&1; then
    POTENCORE_ADMIN_TOKEN="$(openssl rand -hex 24)"
  else
    POTENCORE_ADMIN_TOKEN="potencore-admin-$(date +%s)"
  fi
  export POTENCORE_ADMIN_TOKEN
fi

ensure_env_file

if [[ "${EUID}" -ne 0 ]]; then
  if groups "$USER" | grep -q '\bdocker\b'; then
    docker compose up -d --build
  else
    run_root docker compose up -d --build
  fi
else
  docker compose up -d --build
fi

print_summary
