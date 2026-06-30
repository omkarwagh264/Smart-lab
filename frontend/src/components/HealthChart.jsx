// src/components/HealthChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { STATUS_META, EQUIPMENT_TYPES } from '../constants';

export default function HealthChart({ equipment }) {
  const statusCounts = Object.keys(STATUS_META).map((status) => ({
    name: status,
    value: equipment.filter((e) => e.status === status).length,
    color: STATUS_META[status].color,
  })).filter((d) => d.value > 0);

  const typeCounts = EQUIPMENT_TYPES.map((type) => ({
    type: type.replace(' System', '').replace(' Module', ''),
    count: equipment.filter((e) => e.type === type).length,
  })).filter((d) => d.count > 0);

  if (equipment.length === 0) return null;

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <h3>Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
              {statusCounts.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#252B31', border: '1px solid #3A4149', borderRadius: 8, color: '#E8EAED' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#A0A8B0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Equipment by Type</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={typeCounts} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A4149" />
            <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#A0A8B0' }} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11, fill: '#A0A8B0' }} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#252B31', border: '1px solid #3A4149', borderRadius: 8, color: '#E8EAED' }} />
            <Bar dataKey="count" fill="#FF8A3D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
