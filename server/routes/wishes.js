const { Router } = require('express');
const { pool } = require('../db');

const router = Router();

// GET wishes for event
router.get('/events/:eventId/wishes', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM wishes WHERE event_id = $1 ORDER BY (reserved_by IS NOT NULL), created_at DESC',
      [req.params.eventId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create wish
router.post('/events/:eventId/wishes', async (req, res) => {
  try {
    const { title, url, image_url } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO wishes (event_id, title, url, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.params.eventId, title, url || '', image_url || '']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update wish
router.put('/wishes/:id', async (req, res) => {
  try {
    const { title, url, image_url } = req.body;
    const { rows } = await pool.query(
      'UPDATE wishes SET title=$1, url=$2, image_url=$3 WHERE id=$4 RETURNING *',
      [title, url || '', image_url || '', req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Wish not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reserve wish
router.put('/wishes/:id/reserve', async (req, res) => {
  try {
    const { name } = req.body;
    const { rows } = await pool.query(
      'UPDATE wishes SET reserved_by=$1 WHERE id=$2 RETURNING *',
      [name, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Wish not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT unreserve wish
router.put('/wishes/:id/unreserve', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE wishes SET reserved_by=NULL WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Wish not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE wish
router.delete('/wishes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM wishes WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
