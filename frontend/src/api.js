// Sends the resume PDF and job description to the backend and returns the analysis.
export async function analyzeResume(file, jobDescription) {
  const body = new FormData();
  body.append("resume", file);
  body.append("jobDescription", jobDescription);

  const res = await fetch("/api/analyze", { method: "POST", body });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Analysis failed. Please try again.");
  }
  return data;
}
