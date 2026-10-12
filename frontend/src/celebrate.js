import confetti from "canvas-confetti";

// Theme colors: pink, blue, plum and white.
const COLORS = ["#EEAECA", "#94BBE9", "#6B2D5C", "#FFFFFF"];

// Shoots a paper-style confetti blast from the middle of the screen.
// Users who ask for reduced motion get no confetti. The popup still shows, since it is static.
export function fireCelebration() {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  // Sits above the popup overlay so the paper falls over the card.
  const base = { colors: COLORS, zIndex: 1100, disableForReducedMotion: true, scalar: 1.1 };

  confetti({ ...base, particleCount: 140, spread: 85, startVelocity: 50, origin: { x: 0.5, y: 0.45 } });
  setTimeout(() => {
    confetti({ ...base, particleCount: 60, spread: 120, startVelocity: 30, origin: { x: 0.5, y: 0.35 } });
  }, 220);
}
