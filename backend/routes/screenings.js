const express = require('express');
const db      = require('../database/db-connector');
const router  = express.Router();

// GET /screenings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Screenings;');
    res.json(rows);
  } catch (err) {
    console.error('GET /screenings error:', err);
    res.status(500).send('Error fetching screenings');
  }
});

module.exports = router;