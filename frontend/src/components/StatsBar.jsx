// src/components/StatsBar.jsx
export default function StatsBar({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: 'Total Equipment', value: stats.total, accent: '#FF8A3D' },
    { label: 'Active', value: stats.active, accent: '#2DD4BF' },
    { label: 'Under Maintenance', value: stats.underMaintenance, accent: '#F5B544' },
    { label: 'Decommissioned', value: stats.decommissioned, accent: '#6B7280' },
    { label: 'Avg. Health Score', value: `${stats.averageHealth}%`, accent: '#7C9CFF' },
  ];

  return (
    <div className="stats-bar">
      {cards.map((card) => (
        <div className="stat-card" key={card.label} style={{ '--accent': card.accent }}>
          <span className="stat-card__value">{card.value}</span>
          <span className="stat-card__label">{card.label}</span>
        </div>
      ))}
    </div>
  );
}
