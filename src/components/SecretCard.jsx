import './SecretCard.css';

function ScoreBar({ score }) {
  if (score == null) return null;
  const pct = (score / 10) * 100;
  const color = score <= 3 ? '#3a9e65' : score <= 6 ? '#c9a84c' : '#c94444';
  const fires = score >= 8 ? '🔥🔥' : score >= 5 ? '🔥' : '';

  return (
    <div className="score-bar-wrap">
      <div className="score-bar-label">
        <span>Embarrassment</span>
        <span className="score-val">{score}/10 {fires}</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function SecretCard({ s }) {
  return (
    <div className="secret-card">
      <div className="secret-quote-mark">"</div>
      <div className="secret-text">
        {s.secret || s.message || '—'}
      </div>
      <ScoreBar score={s.emScore} />
      <div className="secret-meta">
        {s.id       && <span className="meta-chip">#{s.id}</span>}
        {s.username && <span className="meta-chip">@{s.username}</span>}
        {s.timestamp && (
          <span className="meta-chip meta-time">
            {new Date(s.timestamp).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
