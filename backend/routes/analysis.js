const express = require("express");
const { uploadResume } = require("../middleware/upload");
const { analyzeUpload, listAnalyses } = require("../controllers/analysisController");
const { asyncHandler } = require("../utils");

const router = express.Router();

router.post("/analyze", uploadResume.single("resume"), asyncHandler(analyzeUpload));
router.get("/analyses", asyncHandler(listAnalyses));

module.exports = router;
