// src/components/ImportCsvModal.jsx
import { useState } from 'react';
import { api } from '../api';

export default function ImportCsvModal({ onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.importCsv(file);
      setResult(res.data);
      onImported();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="import-modal">
      <p>
        Upload a CSV with columns: <span className="mono">name, type, status, location,
        serial_number, description, health_score, last_maintained</span>.
        Rows with invalid type/status or duplicate serial numbers are skipped and reported below.
      </p>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {error && <p className="form-errors">{error}</p>}

      {result && (
        <div className="import-result">
          <p>✅ Inserted: <strong>{result.inserted}</strong></p>
          <p>⚠️ Skipped: <strong>{result.skipped}</strong></p>
          {result.errors.length > 0 && (
            <ul>
              {result.errors.map((e, i) => (
                <li key={i}>{e.row}: {e.errors.join(', ')}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn--ghost" onClick={onClose}>Close</button>
        <button className="btn btn--primary" onClick={handleImport} disabled={!file || loading}>
          {loading ? 'Importing…' : 'Import'}
        </button>
      </div>
    </div>
  );
}
