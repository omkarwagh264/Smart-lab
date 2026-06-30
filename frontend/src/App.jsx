// src/App.jsx
import { useEffect, useState, useCallback } from 'react';
import { api } from './api';
import StatsBar from './components/StatsBar';
import Toolbar from './components/Toolbar';
import EquipmentCard from './components/EquipmentCard';
import Modal from './components/Modal';
import EquipmentForm from './components/EquipmentForm';
import ConfirmDelete from './components/ConfirmDelete';
import ImportCsvModal from './components/ImportCsvModal';
import HealthChart from './components/HealthChart';

export default function App() {
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', type: '', status: '' });

  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete' | 'import' | null
  const [activeItem, setActiveItem] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eqRes, statsRes] = await Promise.all([
        api.getEquipment(filters),
        api.getStats(),
      ]);
      setEquipment(eqRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(loadData, 250); // debounce search typing
    return () => clearTimeout(timer);
  }, [loadData]);

  function closeModal() {
    setModal(null);
    setActiveItem(null);
  }

  async function handleAdd(payload) {
    await api.createEquipment(payload);
    closeModal();
    loadData();
  }

  async function handleEdit(payload) {
    await api.updateEquipment(activeItem.id, payload);
    closeModal();
    loadData();
  }

  async function handleDelete() {
    await api.deleteEquipment(activeItem.id);
    closeModal();
    loadData();
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__mark" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="11" stroke="#FF8A3D" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="3.5" fill="#2DD4BF" />
            </svg>
          </span>
          <div>
            <h1>SmartLab</h1>
            <p>Equipment Manager · CADMech Engineering</p>
          </div>
        </div>
        <button className="btn btn--ghost" onClick={() => setShowCharts((s) => !s)}>
          {showCharts ? 'Hide Insights' : 'Show Insights'}
        </button>
      </header>

      <main className="app-main">
        <StatsBar stats={stats} />

        {showCharts && <HealthChart equipment={equipment} />}

        <Toolbar
          filters={filters}
          onFilterChange={setFilters}
          onAddClick={() => setModal('add')}
          onImportClick={() => setModal('import')}
        />

        {error && (
          <div className="banner banner--error">
            <strong>Couldn&apos;t reach the backend.</strong> {error}
          </div>
        )}

        {loading && !error && <div className="loading-state">Loading equipment…</div>}

        {!loading && !error && equipment.length === 0 && (
          <div className="empty-state">
            <p>No equipment matches your filters.</p>
            <button className="btn btn--primary" onClick={() => setModal('add')}>Add your first item</button>
          </div>
        )}

        {!loading && !error && equipment.length > 0 && (
          <div className="equip-grid">
            {equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onEdit={(it) => { setActiveItem(it); setModal('edit'); }}
                onDelete={(it) => { setActiveItem(it); setModal('delete'); }}
              />
            ))}
          </div>
        )}
      </main>

      {modal === 'add' && (
        <Modal title="Add Equipment" onClose={closeModal}>
          <EquipmentForm onSubmit={handleAdd} onCancel={closeModal} submitLabel="Add Equipment" />
        </Modal>
      )}

      {modal === 'edit' && activeItem && (
        <Modal title="Edit Equipment" onClose={closeModal}>
          <EquipmentForm initial={activeItem} onSubmit={handleEdit} onCancel={closeModal} submitLabel="Save Changes" />
        </Modal>
      )}

      {modal === 'delete' && activeItem && (
        <Modal title="Confirm Delete" onClose={closeModal} width="420px">
          <ConfirmDelete item={activeItem} onConfirm={handleDelete} onCancel={closeModal} />
        </Modal>
      )}

      {modal === 'import' && (
        <Modal title="Import Equipment CSV" onClose={closeModal} width="480px">
          <ImportCsvModal onClose={closeModal} onImported={loadData} />
        </Modal>
      )}
    </div>
  );
}
