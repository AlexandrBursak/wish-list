const { Router } = require('express');
const { pool } = require('../db');

const router = Router();

// GET all events with wish count
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT e.*,
        COUNT(w.id)::int AS wish_count,
        COUNT(w.reserved_by)::int AS reserved_count
      FROM events e
      LEFT JOIN wishes w ON w.event_id = e.id
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const { title, description, date, emoji } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO events (title, description, date, emoji) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description || '', date || null, emoji || '🎁']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, date, emoji } = req.body;
    const { rows } = await pool.query(
      'UPDATE events SET title=$1, description=$2, date=$3, emoji=$4 WHERE id=$5 RETURNING *',
      [title, description, date || null, emoji, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
