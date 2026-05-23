import { AnalysisRequest, AIAnalysisResponse } from "./types/browser-profile";

export async function sendAnalysis(request: AnalysisRequest): Promise<AIAnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Fingerprint evaluation failed" }));
    throw new Error(errorData.detail || `HTTP Error ${response.status}`);
  }

  return response.json();
}

export async function fetchAdminStats(adminSecret: string): Promise<any> {
  const response = await fetch("/api/admin?action=stats", {
    headers: {
      "Authorization": `Bearer ${adminSecret}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Admin authentication failed" }));
    throw new Error(errorData.detail || "Verification failed");
  }

  return response.json();
}

export async function fetchAdminScans(adminSecret: string, page: number = 1): Promise<any> {
  const response = await fetch(`/api/admin?action=scans&page=${page}`, {
    headers: {
      "Authorization": `Bearer ${adminSecret}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Admin authentication failed" }));
    throw new Error(errorData.detail || "Verification failed");
  }

  return response.json();
}
