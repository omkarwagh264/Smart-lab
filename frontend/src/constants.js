// src/constants.js
export const EQUIPMENT_TYPES = [
  'CNC Machine',
  'IoT Sensor',
  'Automation Trainer',
  'PLC Module',
  'Hydraulic System',
  'Pneumatic System',
  'Electrical Panel',
];

export const EQUIPMENT_STATUSES = ['Active', 'Under Maintenance', 'Decommissioned'];

export const STATUS_META = {
  Active: { color: '#2DD4BF', glow: 'rgba(45, 212, 191, 0.35)', label: 'Active' },
  'Under Maintenance': { color: '#FF8A3D', glow: 'rgba(255, 138, 61, 0.35)', label: 'Under Maintenance' },
  Decommissioned: { color: '#6B7280', glow: 'rgba(107, 114, 128, 0.3)', label: 'Decommissioned' },
};

export const TYPE_ICONS = {
  'CNC Machine': '⚙️',
  'IoT Sensor': '📡',
  'Automation Trainer': '🤖',
  'PLC Module': '🔌',
  'Hydraulic System': '🛢️',
  'Pneumatic System': '💨',
  'Electrical Panel': '🔋',
};
