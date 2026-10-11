// Skill catalog. Each skill matches its name or any alias as a whole phrase.
// This list is the stand-in for the AI extraction step, which will replace it later.
const SKILL_CATALOG = [
  { name: "JavaScript", aliases: ["javascript", "js", "ecmascript"] },
  { name: "TypeScript", aliases: ["typescript"] },
  { name: "React", aliases: ["react", "reactjs", "react.js"] },
  { name: "Node.js", aliases: ["node.js", "nodejs"] },
  { name: "Express", aliases: ["express.js", "expressjs"] },
  { name: "Python", aliases: ["python"] },
  { name: "Java", aliases: ["java"] },
  { name: "C++", aliases: ["c++"] },
  { name: "SQL", aliases: ["sql"] },
  { name: "PostgreSQL", aliases: ["postgresql", "postgres"] },
  { name: "MongoDB", aliases: ["mongodb"] },
  { name: "Docker", aliases: ["docker"] },
  { name: "Kubernetes", aliases: ["kubernetes", "k8s"] },
  { name: "AWS", aliases: ["aws", "amazon web services"] },
  { name: "Git", aliases: ["git"] },
  { name: "REST APIs", aliases: ["rest api", "rest apis", "restful"] },
  { name: "GraphQL", aliases: ["graphql"] },
  { name: "CI/CD", aliases: ["ci/cd", "cicd", "github actions", "jenkins"] },
  { name: "Jest", aliases: ["jest"] },
  { name: "Accessibility", aliases: ["accessibility", "a11y", "wcag"] },
  { name: "Performance", aliases: ["performance optimization", "performance tuning"] },
  { name: "System Design", aliases: ["system design"] },
  { name: "Agile", aliases: ["agile", "scrum"] },
  { name: "Communication", aliases: ["communication skills"] },
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A match must not sit inside a longer word. The lookbehind also rejects a "." before
// the alias, so "js" does not match inside "node.js".
const SKILL_PATTERNS = SKILL_CATALOG.map(({ name, aliases }) => ({
  name,
  patterns: aliases.map((alias) => new RegExp(`(?<![a-z0-9.])${escapeRegex(alias)}(?![a-z0-9])`)),
}));

// Returns the catalog skill names found in the text, in catalog order.
function extractSkills(text) {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  return SKILL_PATTERNS.filter(({ patterns }) => patterns.some((p) => p.test(normalized))).map(
    ({ name }) => name
  );
}

module.exports = { SKILL_CATALOG, extractSkills };
