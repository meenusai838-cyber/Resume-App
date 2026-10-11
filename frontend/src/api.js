// Backend base URL. Empty in local dev, where Vite proxies /api to the local server.
// In production it is the deployed backend, e.g. https://your-backend.vercel.app
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Sends the resume PDF and job description to the backend and returns the analysis.
export async function analyzeResume(file, jobDescription) {
  const body = new FormData();
  body.append("resume", file);
  body.append("jobDescription", jobDescription);

  const res = await fetch(`${API_BASE}/api/analyze`, { method: "POST", body });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Analysis failed. Please try again.");
  }
  return data;
}
