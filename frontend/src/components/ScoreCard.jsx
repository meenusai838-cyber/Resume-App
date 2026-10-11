import { useEffect, useState } from "react";

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function verdictFor(score) {
  if (score >= 80) return "Strong: interview-ready.";
  if (score >= 65) return "Solid draft: a few gaps to close.";
  if (score >= 50) return "Needs work: key skills aren't showing.";
  return "Weak: recruiters will skim past this.";
}

// Shows the 0-100 score ring, counting up and sweeping to the score on mount.
export default function ScoreCard({ score, fileName, matchedCount, totalCount }) {
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
    <div className="score-card">
      <div className="score-ring">
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
        <div className="score-number">
          <span>{displayScore}</span>
          <small>/100</small>
        </div>
      </div>
      <div className="score-meta">
        <p className="verdict">{verdictFor(score)}</p>
        <p className="match-count">
          {matchedCount} of {totalCount} skills from the job description found on the resume
        </p>
        <p className="file-name">{fileName}</p>
      </div>
    </div>
  );
}
