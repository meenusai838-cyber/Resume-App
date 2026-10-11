const Analysis = require("../models/Analysis");

// Saves one analysis to MongoDB and returns the saved document.
function saveAnalysis(data) {
  return Analysis.create(data);
}

// Returns the most recent analyses, newest first.
function findRecentAnalyses(limit = 10) {
  return Analysis.find().sort({ createdAt: -1 }).limit(limit).lean();
}

module.exports = { saveAnalysis, findRecentAnalyses };
