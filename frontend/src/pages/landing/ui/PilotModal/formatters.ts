export function formatCyrillicName(value: string) {
  return value.replace(/[^А-Яа-яЁё\s-]/g, "").replace(/\s{2,}/g, " ");
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  const hasRussianPrefix = digits.startsWith("7");
  const phoneBody = hasRussianPrefix ? digits.slice(1) : digits;
  const parts = [
    phoneBody.slice(0, 3),
    phoneBody.slice(3, 6),
    phoneBody.slice(6, 8),
    phoneBody.slice(8, 10)
  ].filter(Boolean);

  if (!hasRussianPrefix) {
    return parts.join(" ");
  }

  let formatted = "+7";

  if (parts[0]) {
    formatted += ` ${parts[0]}`;
  }

  if (parts[1]) {
    formatted += ` ${parts[1]}`;
  }

  if (parts[2]) {
    formatted += `-${parts[2]}`;
  }

  if (parts[3]) {
    formatted += `-${parts[3]}`;
  }

  return formatted;
}
