// Lists skills under a heading. variant is "present" or "missing" and sets the colors.
export default function SkillsPanel({ variant, title, skills, emptyText }) {
  return (
    <div className={`skill-group ${variant}`}>
      <h2>{title}</h2>
      {skills.length > 0 ? (
        <ul className="chip-list">
          {skills.map((skill) => (
            <li key={skill} className="chip">
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{emptyText}</p>
      )}
    </div>
  );
}
