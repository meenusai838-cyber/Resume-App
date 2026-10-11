// Backend base URL. Empty in local dev, where Vite proxies /api to the local server.
// In production it must be set to the deployed backend, e.g. https://your-backend.vercel.app
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// Sends the resume PDF and job description to the backend and returns the analysis.
export async function analyzeResume(file, jobDescription) {
  if (import.meta.env.PROD && !API_BASE) {
    throw new Error("This site isn't configured yet: VITE_API_URL is not set in the Vercel project.");
  }

  const body = new FormData();
  body.append("resume", file);
  body.append("jobDescription", jobDescription);

  let res;
  try {
    res = await fetch(`${API_BASE}/api/analyze`, { method: "POST", body });
  } catch {
    throw new Error(
      `Couldn't reach the API${API_BASE ? ` at ${API_BASE}` : ""}. Check that the backend is deployed and that its CLIENT_ORIGIN matches this site.`
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Analysis failed. Please try again.");
  }
  return data;
}
