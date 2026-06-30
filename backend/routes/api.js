// backend/routes/api.js
const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const db = require('../db');
const {
  calculateHealthScore,
  aggregateStats,
  validateEquipmentPayload,
} = require('../utils/healthScore');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ---- GET /api/equipment  (list, with search/filter) ----
router.get('/equipment', async (req, res) => {
  try {
    const { search, type, status } = req.query;

    let query = 'SELECT * FROM equipment WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR serial_number LIKE ? OR location LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY updated_at DESC';

    const rows = await db.all(query, params);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch equipment' });
  }
});

// ---- GET /api/stats  (dashboard summary) ----
router.get('/stats', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM equipment');
    const stats = aggregateStats(rows);
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to compute stats' });
  }
});

// ---- GET /api/equipment/:id ----
router.get('/equipment/:id', async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, error: 'Equipment not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch equipment' });
  }
});

// ---- POST /api/equipment ----
router.post('/equipment', async (req, res) => {
  try {
    const payload = req.body;
    const { valid, errors } = validateEquipmentPayload(payload);
    if (!valid) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }

    const existingSerial = await db.get(
      'SELECT id FROM equipment WHERE serial_number = ?',
      [payload.serial_number]
    );
    if (existingSerial) {
      return res.status(409).json({ success: false, error: 'Serial number already exists' });
    }

    const healthScore = payload.health_score ?? calculateHealthScore(
      payload.last_maintained, payload.status
    );

    const { lastInsertRowid } = await db.run(
      `INSERT INTO equipment (name, type, status, location, serial_number, description, health_score, last_maintained)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.name,
        payload.type,
        payload.status,
        payload.location,
        payload.serial_number,
        payload.description || '',
        healthScore,
        payload.last_maintained || null,
      ]
    );

    const created = await db.get('SELECT * FROM equipment WHERE id = ?', [lastInsertRowid]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create equipment' });
  }
});

// ---- PUT /api/equipment/:id ----
router.put('/equipment/:id', async (req, res) => {
  try {
    const existing = await db.get('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'Equipment not found' });

    const payload = { ...existing, ...req.body };
    const { valid, errors } = validateEquipmentPayload(payload);
    if (!valid) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }

    if (payload.serial_number !== existing.serial_number) {
      const clash = await db.get(
        'SELECT id FROM equipment WHERE serial_number = ? AND id != ?',
        [payload.serial_number, req.params.id]
      );
      if (clash) {
        return res.status(409).json({ success: false, error: 'Serial number already exists' });
      }
    }

    await db.run(
      `UPDATE equipment SET
         name = ?, type = ?, status = ?, location = ?,
         serial_number = ?, description = ?,
         health_score = ?, last_maintained = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        payload.name,
        payload.type,
        payload.status,
        payload.location,
        payload.serial_number,
        payload.description || '',
        payload.health_score,
        payload.last_maintained || null,
        req.params.id,
      ]
    );

    const updated = await db.get('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update equipment' });
  }
});

// ---- DELETE /api/equipment/:id ----
router.delete('/equipment/:id', async (req, res) => {
  try {
    const existing = await db.get('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'Equipment not found' });

    await db.run('DELETE FROM equipment WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: { id: Number(req.params.id) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete equipment' });
  }
});

// ---- POST /api/equipment/import  (Tier 2: CSV import) ----
router.post('/equipment/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const records = parse(req.file.buffer.toString('utf8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const results = { inserted: 0, skipped: 0, errors: [] };

    await db.transaction(async () => {
      for (const row of records) {
        const { valid, errors } = validateEquipmentPayload(row);
        if (!valid) {
          results.skipped += 1;
          results.errors.push({ row: row.serial_number || row.name || 'unknown', errors });
          continue;
        }
        try {
          const dupe = await db.get(
            'SELECT id FROM equipment WHERE serial_number = ?',
            [row.serial_number]
          );
          if (dupe) {
            results.skipped += 1;
            results.errors.push({
              row: row.serial_number,
              errors: ['Duplicate serial number'],
            });
            continue;
          }

          await db.run(
            `INSERT INTO equipment (name, type, status, location, serial_number, description, health_score, last_maintained)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              row.name,
              row.type,
              row.status,
              row.location,
              row.serial_number,
              row.description || '',
              row.health_score ? Number(row.health_score) : calculateHealthScore(row.last_maintained, row.status),
              row.last_maintained || null,
            ]
          );
          results.inserted += 1;
        } catch (e) {
          results.skipped += 1;
          results.errors.push({ row: row.serial_number || row.name || 'unknown', errors: [e.message] });
        }
      }
    });

    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to import CSV' });
  }
});

module.exports = router;
