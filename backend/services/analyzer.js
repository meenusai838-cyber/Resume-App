const { extractSkills } = require("./skills");
const { httpError } = require("../utils");

// Compares a resume against a job description.
// Score = share of the job's skills that the resume also shows.
function analyzeResume(resumeText, jobDescription) {
  const requiredSkills = extractSkills(jobDescription);
  if (requiredSkills.length === 0) {
    throw httpError(
      422,
      "No recognizable skills found in the job description. Add the required skills and try again."
    );
  }

  const resumeSkills = new Set(extractSkills(resumeText));
  const matchedSkills = requiredSkills.filter((skill) => resumeSkills.has(skill));
  const missingSkills = requiredSkills.filter((skill) => !resumeSkills.has(skill));
  const score = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return { score, matchedSkills, missingSkills };
}

module.exports = { analyzeResume };
