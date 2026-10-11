const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    resumeFileName: { type: String, required: true },
    jobDescription: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    matchedSkills: [String],
    missingSkills: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);
