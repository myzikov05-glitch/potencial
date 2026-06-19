import { useEffect, useState } from "react";

import type { DashboardResponse } from "../model/analytics";

export async function fetchDashboard(
  apiBaseUrl: string,
  token: string
): Promise<DashboardResponse> {
  const response = await fetch(`${apiBaseUrl}/analytics/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error(`dashboard fetch failed: ${response.status}`);
  }
  return (await response.json()) as DashboardResponse;
}

type DashboardState = {
  data: DashboardResponse | null;
  status: "loading" | "ready" | "error";
};

export function useDashboard(apiBaseUrl: string, token: string | undefined) {
  const [state, setState] = useState<DashboardState>({
    data: null,
    status: "loading"
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    setState({ data: null, status: "loading" });

    fetchDashboard(apiBaseUrl, token)
      .then((data) => {
        if (!cancelled) {
          setState({ data, status: "ready" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ data: null, status: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, token]);

  return state;
}