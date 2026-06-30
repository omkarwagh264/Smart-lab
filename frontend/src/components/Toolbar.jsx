// src/components/Toolbar.jsx
import { EQUIPMENT_TYPES, EQUIPMENT_STATUSES } from '../constants';

export default function Toolbar({ filters, onFilterChange, onAddClick, onImportClick }) {
  return (
    <div className="toolbar">
      <div className="toolbar__search">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, serial, or location…"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      <select
        value={filters.type}
        onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
      >
        <option value="">All types</option>
        {EQUIPMENT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
      >
        <option value="">All statuses</option>
        {EQUIPMENT_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button className="btn btn--ghost" onClick={onImportClick}>
        Import CSV
      </button>
      <button className="btn btn--primary" onClick={onAddClick}>
        + Add Equipment
      </button>
    </div>
  );
}
