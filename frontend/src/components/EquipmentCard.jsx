// src/components/EquipmentCard.jsx
import { STATUS_META, TYPE_ICONS } from '../constants';

export default function EquipmentCard({ item, onEdit, onDelete }) {
  const meta = STATUS_META[item.status] || STATUS_META.Active;
  const health = item.health_score ?? 0;
  const healthColor = health >= 70 ? '#2DD4BF' : health >= 40 ? '#F5B544' : '#F2545B';

  return (
    <article className="equip-card" style={{ '--status-color': meta.color, '--status-glow': meta.glow }}>
      <div className="equip-card__top">
        <span className="equip-card__icon" aria-hidden="true">{TYPE_ICONS[item.type] || '🔧'}</span>
        <span className="equip-card__status">
          <span className="equip-card__led" />
          {meta.label}
        </span>
      </div>

      <h3 className="equip-card__name">{item.name}</h3>
      <p className="equip-card__type">{item.type}</p>

      <dl className="equip-card__meta">
        <div>
          <dt>Serial</dt>
          <dd className="mono">{item.serial_number}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{item.location}</dd>
        </div>
      </dl>

      {item.description && <p className="equip-card__desc">{item.description}</p>}

      <div className="equip-card__health">
        <div className="equip-card__health-bar">
          <div
            className="equip-card__health-fill"
            style={{ width: `${Math.max(0, Math.min(100, health))}%`, background: healthColor }}
          />
        </div>
        <span className="mono">{health}% health</span>
      </div>

      <div className="equip-card__actions">
        <button className="btn btn--small btn--ghost" onClick={() => onEdit(item)}>Edit</button>
        <button className="btn btn--small btn--danger" onClick={() => onDelete(item)}>Delete</button>
      </div>
    </article>
  );
}
