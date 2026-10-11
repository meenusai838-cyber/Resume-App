import { useEffect, useRef, useState } from "react";
import { analyzeResume } from "./api.js";
import UploadCard from "./components/UploadCard.jsx";
import ScoreCard from "./components/ScoreCard.jsx";
import SkillsPanel from "./components/SkillsPanel.jsx";

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [result]);

  function chooseFile(selected) {
    if (!selected) return;
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("That's not a PDF. Upload your resume as a PDF.");
      return;
    }
    setError("");
    setFile(selected);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setError("Choose a PDF resume first.");
    if (!jobDescription.trim()) return setError("Paste a job description to compare against.");

    setError("");
    setResult(null);
    setAnalyzing(true);
    try {
      setResult(await analyzeResume(file, jobDescription));
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setResult(null);
    setFile(null);
    setError("");
  }

  const totalSkills = result ? result.matchedSkills.length + result.missingSkills.length : 0;

  return (
    <>
      <header className="nav">
        <a className="logo" href="#">
          0<span className="arrow">→</span>Shipped
        </a>
        <nav>
          <a href="#demo">Try it</a>
          <a href="#how">How it works</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">Mock build · scoring uses a skill list, AI comes later</p>
          <h1>
            Score your resume <span className="accent">before a recruiter does.</span>
          </h1>
          <p className="sub">
            Upload your resume PDF and paste a job description. See which required skills your
            resume shows, and which ones it's missing.
          </p>
        </section>

        <section className="demo" id="demo">
          <form className="analyze-form" onSubmit={handleSubmit}>
            <UploadCard file={file} onSelect={chooseFile} disabled={analyzing} />

            <label className="field-label" htmlFor="jobDescription">
              Job description
            </label>
            <textarea
              id="jobDescription"
              className="jd-input"
              rows={8}
              placeholder="Paste the job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={analyzing}
            />

            <button className="primary" type="submit" disabled={analyzing}>
              {analyzing && <span className="spinner small" aria-hidden="true" />}
              {analyzing ? "Analyzing…" : "Analyze resume"}
            </button>
          </form>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {result && (
            <section className="results" ref={resultsRef}>
              <ScoreCard
                key={result.id}
                score={result.score}
                fileName={result.resumeFileName}
                matchedCount={result.matchedSkills.length}
                totalCount={totalSkills}
              />

              <div className="skills">
                <SkillsPanel
                  variant="present"
                  title="✓ Skills present"
                  skills={result.matchedSkills}
                  emptyText="None of the job's skills were found on this resume."
                />
                <SkillsPanel
                  variant="missing"
                  title="✗ Skills missing"
                  skills={result.missingSkills}
                  emptyText="Nothing missing. Every required skill is on the resume."
                />
              </div>

              <button className="ghost" type="button" onClick={reset}>
                Try another resume
              </button>
            </section>
          )}
        </section>

        <section className="how" id="how">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step">
              <span className="step-num">1</span>
              <h3>Upload</h3>
              <p>Drop in your resume PDF and paste the job description you're targeting.</p>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <h3>Compare</h3>
              <p>The backend reads the PDF text and finds the skills the job asks for.</p>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <h3>Score</h3>
              <p>You get a 0–100 score, the skills present, and the gaps to fill.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>0 → Shipped · resume parser. Demo build: scoring is keyword-based for now.</p>
      </footer>
    </>
  );
}
