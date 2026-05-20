import SecretCard from './SecretCard';

export default function SecretsDisplay({ secrets, loading }) {
  if (loading) return <div className="spinner" />;

  if (secrets.length === 0) return null;

  return (
    <div>
      <div className="results-header">
        <span className="results-count">
          {secrets.length} {secrets.length === 1 ? 'secret' : 'secrets'} found
        </span>
      </div>
      <div className="secrets-grid">
        {secrets.map((s, i) => (
          <SecretCard key={s.id ?? i} s={s} />
        ))}
      </div>
    </div>
  );
}
