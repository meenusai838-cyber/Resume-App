const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    resumeFileName: { type: String, required: true },
    jobDescription: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    fit: { type: String, enum: ["strong fit", "possible fit", "not a fit yet"] },
    resumeField: String,
    jobField: String,
    matchedSkills: [String],
    missingSkills: [String],
    summary: String,
    tips: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);
