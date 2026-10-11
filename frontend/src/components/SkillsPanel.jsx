// Lists skills under a heading. variant is "present" or "missing" and sets the colors.
// icon is the mark shown on the heading and on each skill ("✓" or "✗").
export default function SkillsPanel({ variant, title, icon, skills, emptyText }) {
  return (
    <div className={`skill-group glass ${variant}`}>
      <h2>
        <span aria-hidden="true">{icon}</span>
        {title}
      </h2>
      {skills.length > 0 ? (
        <ul className="chip-list">
          {skills.map((skill) => (
            <li key={skill} className="chip">
              <span className="chip-icon" aria-hidden="true">
                {icon}
              </span>
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
