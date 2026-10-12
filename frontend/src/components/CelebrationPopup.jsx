import { useEffect, useRef } from "react";

// Popup shown when the resume is a strong fit. Closes with the button, the Escape key, or a click outside the card.
export default function CelebrationPopup({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="celebrate-overlay" onClick={onClose}>
      <div
        className="celebrate-card glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebrate-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="celebrate-icon" aria-hidden="true">🎉</div>
        <h2 id="celebrate-title">You're a strong fit for this role!</h2>
        <p>Your resume lines up well with this job. Go apply with confidence.</p>
        <button ref={closeRef} className="primary" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
