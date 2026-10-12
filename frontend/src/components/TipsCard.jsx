// Short, specific tips for improving the resume for this job. Renders nothing when there are no tips.
export default function TipsCard({ tips }) {
  if (!tips?.length) return null;

  return (
    <div className="tips-card glass">
      <h2>
        <span aria-hidden="true">💡</span>
        Tips to strengthen your resume
      </h2>
      <ol className="tips-list">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ol>
    </div>
  );
}
