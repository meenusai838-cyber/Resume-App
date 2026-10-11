// 0 → Shipped · resume parser demo
// All "parsing" is mocked: results are picked deterministically from the
// file name, so the same resume always gets the same score.

const SKILL_POOL = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "PostgreSQL", "Docker", "Kubernetes", "AWS", "Git", "REST APIs",
  "GraphQL", "CI/CD", "Jest", "Accessibility", "Performance", "System Design",
  "Agile", "Communication",
];

const el = (id) => document.getElementById(id);

const uploadCard = el("uploadCard");
const fileInput = el("fileInput");
const uploadIdle = el("uploadIdle");
const uploadAnalyzing = el("uploadAnalyzing");
const analyzingText = el("analyzingText");
const errorText = el("errorText");
const results = el("results");

// ---- upload wiring ----

uploadCard.addEventListener("click", () => fileInput.click());
el("browseBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
});

["dragenter", "dragover"].forEach((evt) =>
  uploadCard.addEventListener(evt, (e) => {
    e.preventDefault();
    uploadCard.classList.add("dragover");
  })
);

["dragleave", "drop"].forEach((evt) =>
  uploadCard.addEventListener(evt, (e) => {
    e.preventDefault();
    uploadCard.classList.remove("dragover");
  })
);

uploadCard.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

el("resetBtn").addEventListener("click", reset);

function handleFile(file) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    showError("That's not a PDF — this demo only parses resume PDFs.");
    return;
  }
  hideError();
  results.hidden = true;
  uploadIdle.hidden = true;
  uploadAnalyzing.hidden = false;

  // Fake the parse stages so the demo feels alive.
  const stages = ["Reading your resume…", "Scanning for skills…", "Calculating score…"];
  stages.forEach((text, i) => setTimeout(() => (analyzingText.textContent = text), i * 500));

  setTimeout(() => {
    const result = mockParse(file.name);
    showResult(file.name, result);
    uploadAnalyzing.hidden = true;
    uploadIdle.hidden = false;
    fileInput.value = ""; // allow re-uploading the same file
  }, stages.length * 500 + 300);
}

function reset() {
  results.hidden = true;
  hideError();
  uploadIdle.hidden = false;
  uploadAnalyzing.hidden = true;
  fileInput.value = "";
}

function showError(message) {
  errorText.textContent = message;
  errorText.hidden = false;
}

function hideError() {
  errorText.hidden = true;
}

// ---- mock parser ----

// Small deterministic PRNG so the same file name always yields the same resume.
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mockParse(fileName) {
  const rand = mulberry32(seedFrom(fileName));

  // Shuffle a copy of the skill pool, then split it into present / missing.
  const shuffled = [...SKILL_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const presentCount = 8 + Math.floor(rand() * 6); // 8–13 skills
  const missingCount = 4 + Math.floor(rand() * 4); // 4–7 gaps

  const present = shuffled.slice(0, presentCount);
  const missing = shuffled.slice(presentCount, presentCount + missingCount);
  const score = Math.round((presentCount / (presentCount + missingCount)) * 100);

  return { score, present, missing };
}

// ---- rendering ----

function showResult(fileName, { score, present, missing }) {
  results.hidden = false;

  el("scoreFile").textContent = fileName;
  el("scoreVerdict").textContent = verdictFor(score);

  renderChips(el("presentList"), present);
  renderChips(el("missingList"), missing);

  animateScore(score);
  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function verdictFor(score) {
  if (score >= 80) return "Strong — interview-ready.";
  if (score >= 65) return "Solid draft — a few gaps to close.";
  if (score >= 50) return "Needs work — key skills aren't showing.";
  return "Weak — recruiters will skim past this.";
}

function renderChips(list, skills) {
  list.replaceChildren(
    ...skills.map((skill) => {
      const li = document.createElement("li");
      li.className = "chip";
      li.textContent = skill;
      return li;
    })
  );
}

// Counts the number up and sweeps the SVG ring to the matching fraction.
const RING_CIRCUMFERENCE = 2 * Math.PI * 52;
const ringValue = el("ringValue");
ringValue.style.strokeDasharray = RING_CIRCUMFERENCE;

function animateScore(score) {
  ringValue.style.strokeDashoffset = RING_CIRCUMFERENCE;
  // Force a reflow so the transition always runs, even on repeat uploads.
  ringValue.getBoundingClientRect();
  ringValue.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - score / 100);

  const scoreLabel = el("scoreValue");
  const start = performance.now();
  const duration = 900;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    scoreLabel.textContent = Math.round(eased * score);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
