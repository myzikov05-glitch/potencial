export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (window.location.hostname === "localhost" && window.location.port === "5173") {
    return "http://localhost:8000/api/v1";
  }

  return "/api/v1";
}
