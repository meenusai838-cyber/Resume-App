const multer = require("multer");
const { httpError } = require("../utils");

// Vercel rejects request bodies over about 4.5 MB before they reach the app.
// The limit sits below that so the app returns its own message, and it leaves room for form fields.
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

// Keeps the uploaded file in memory (Vercel's filesystem is not writable or persistent) and accepts only PDFs.
const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_BYTES },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    cb(isPdf ? null : httpError(400, "Only PDF resumes are supported."), isPdf);
  },
});

module.exports = { uploadResume };
