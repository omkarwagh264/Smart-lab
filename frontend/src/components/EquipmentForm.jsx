// src/components/EquipmentForm.jsx
import { useState } from 'react';
import { EQUIPMENT_TYPES, EQUIPMENT_STATUSES } from '../constants';

const EMPTY = {
  name: '',
  type: EQUIPMENT_TYPES[0],
  status: 'Active',
  location: '',
  serial_number: '',
  description: '',
  last_maintained: '',
};

export default function EquipmentForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const errs = [];
    if (!form.name.trim()) errs.push('Name is required.');
    if (!form.location.trim()) errs.push('Location is required.');
    if (!form.serial_number.trim()) errs.push('Serial number is required.');
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors([err.message || 'Something went wrong.']);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="equip-form" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((err) => <p key={err}>{err}</p>)}
        </div>
      )}

      <label>
        Name
        <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Haas VF-2 Mill" />
      </label>

      <div className="form-row">
        <label>
          Type
          <select value={form.type} onChange={(e) => update('type', e.target.value)}>
            {EQUIPMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Status
          <select value={form.status} onChange={(e) => update('status', e.target.value)}>
            {EQUIPMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Location
          <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Bay A1" />
        </label>
        <label>
          Serial Number
          <input value={form.serial_number} onChange={(e) => update('serial_number', e.target.value)} placeholder="e.g. CNC-1001" className="mono" />
        </label>
      </div>

      <label>
        Last Maintained
        <input type="date" value={form.last_maintained || ''} onChange={(e) => update('last_maintained', e.target.value)} />
      </label>

      <label>
        Description
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Optional notes about this equipment…"
        />
      </label>

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
