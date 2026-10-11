const multer = require("multer");
const { httpError } = require("../utils");

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

// Keeps the uploaded file in memory and accepts only PDFs.
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
