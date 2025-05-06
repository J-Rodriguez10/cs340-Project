const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /movies
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Movies;');
    res.json(rows);
  } catch (err) {
    console.error('GET /movies error:', err);
    res.status(500).send('Error fetching movies');
  }
});

module.exports = router;