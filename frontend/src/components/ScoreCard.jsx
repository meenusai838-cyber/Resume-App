import { useEffect, useState } from "react";

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Label and color class for each fit value the backend returns.
const FIT_STYLES = {
  "strong fit": { label: "Strong fit", className: "fit-strong" },
  "possible fit": { label: "Possible fit", className: "fit-possible" },
  "not a fit yet": { label: "Not a fit yet", className: "fit-none" },
};

// Shows the 0-100 score ring, counting up and sweeping to the score on mount.
// Also shows the fit verdict, both fields, and the summary.
export default function ScoreCard({
  score,
  fit,
  resumeField,
  jobField,
  summary,
  fileName,
  matchedCount,
  totalCount,
}) {
  const fitStyle = FIT_STYLES[fit] ?? FIT_STYLES["not a fit yet"];

  const [displayScore, setDisplayScore] = useState(0);
  const [offset, setOffset] = useState(RING_CIRCUMFERENCE);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOffset(RING_CIRCUMFERENCE * (1 - score / 100)));

    const duration = 900;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplayScore(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(raf);
    };
  }, [score]);

  return (
    <div className="score-card glass">
      <div className="score-ring" role="img" aria-label={`Match score ${score} out of 100`}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="ring-bg" cx="60" cy="60" r={RING_RADIUS} />
          <circle
            className="ring-value"
            cx="60"
            cy="60"
            r={RING_RADIUS}
            style={{ strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: offset }}
          />
        </svg>
        <div className="score-number" aria-hidden="true">
          <span>{displayScore}</span>
          <small>/100</small>
        </div>
      </div>
      <div className="score-meta">
        <span className={`fit-badge ${fitStyle.className}`}>{fitStyle.label}</span>
        <p className="field-line">
          Your field: <strong>{resumeField}</strong> · Job field: <strong>{jobField}</strong>
        </p>
        {summary && <p className="summary">{summary}</p>}
        {totalCount > 0 && (
          <p className="match-count">
            {matchedCount} of {totalCount} skills from the job description found on the resume
          </p>
        )}
        <p className="file-name">{fileName}</p>
      </div>
    </div>
  );
}
