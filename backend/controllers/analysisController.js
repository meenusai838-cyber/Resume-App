const { extractText } = require("../services/pdf");
const { analyzeResume } = require("../services/analyzer");
const { saveAnalysis, findRecentAnalyses } = require("../services/analysisService");
const { httpError } = require("../utils");

const formatAnalysis = (doc) => ({
  id: String(doc._id),
  resumeFileName: doc.resumeFileName,
  score: doc.score,
  matchedSkills: doc.matchedSkills,
  missingSkills: doc.missingSkills,
  createdAt: doc.createdAt,
});

// POST /api/analyze: multipart form with a "resume" PDF and a "jobDescription" text field.
async function analyzeUpload(req, res) {
  if (!req.file) throw httpError(400, "Upload a PDF resume.");

  const jobDescription = (req.body.jobDescription || "").trim();
  if (!jobDescription) throw httpError(400, "Paste a job description to compare against.");

  let resumeText;
  try {
    resumeText = await extractText(req.file.buffer);
  } catch (parseErr) {
    console.error("PDF parse failed:", parseErr.message);
    throw httpError(
      422,
      "This PDF couldn't be opened. Try exporting it again or upload a different file."
    );
  }
  if (!resumeText) {
    throw httpError(
      422,
      "Couldn't read any text from this PDF. Scanned, image-only PDFs aren't supported yet."
    );
  }

  const result = analyzeResume(resumeText, jobDescription);
  const saved = await saveAnalysis({
    resumeFileName: req.file.originalname,
    jobDescription,
    ...result,
  });

  res.status(201).json(formatAnalysis(saved));
}

// GET /api/analyses: the 10 most recent analyses.
async function listAnalyses(req, res) {
  const docs = await findRecentAnalyses();
  res.json(docs.map(formatAnalysis));
}

module.exports = { analyzeUpload, listAnalyses };
