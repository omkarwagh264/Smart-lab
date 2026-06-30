-- SmartLab Equipment Manager - Database Schema
-- SQLite (also valid as near-equivalent for MySQL/PostgreSQL with minor type tweaks)

CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN (
    'CNC Machine', 'IoT Sensor', 'Automation Trainer',
    'PLC Module', 'Hydraulic System', 'Pneumatic System', 'Electrical Panel'
  )),
  status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN (
    'Active', 'Under Maintenance', 'Decommissioned'
  )),
  location TEXT NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  description TEXT,
  health_score INTEGER DEFAULT 100,
  last_maintained DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_name ON equipment(name);

-- Seed data for local development / first deploy
INSERT INTO equipment (name, type, status, location, serial_number, description, health_score, last_maintained) VALUES
('Haas VF-2 Mill', 'CNC Machine', 'Active', 'Bay A1', 'CNC-1001', '3-axis vertical machining center', 92, '2026-05-12'),
('Fanuc PLC Trainer', 'PLC Module', 'Active', 'Bay B2', 'PLC-2003', 'Industrial automation training rig', 87, '2026-04-30'),
('Temp/Humidity Sensor', 'IoT Sensor', 'Active', 'Lab Floor', 'IOT-3091', 'Wireless environment monitoring node', 95, '2026-06-01'),
('Hydraulic Press Demo', 'Hydraulic System', 'Under Maintenance', 'Bay C1', 'HYD-4042', 'Bench-top hydraulic press for demos', 54, '2026-03-18'),
('Pneumatic Cylinder Rig', 'Pneumatic System', 'Active', 'Bay C2', 'PNU-5077', 'Dual-acting cylinder test setup', 78, '2026-05-22'),
('Old Distribution Panel', 'Electrical Panel', 'Decommissioned', 'Storage Room', 'ELP-6004', 'Legacy panel, replaced in 2025', 12, '2024-11-02'),
('Automation Trainer Kit', 'Automation Trainer', 'Active', 'Bay A2', 'AUT-7019', 'Conveyor + sensor automation trainer', 88, '2026-06-10'),
('Vibration Sensor Node', 'IoT Sensor', 'Under Maintenance', 'Bay B1', 'IOT-3092', 'Predictive maintenance sensor', 40, '2026-02-14');
