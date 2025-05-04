const express = require('express');
const db      = require('../database/db-connector');
const router  = express.Router();

// GET /tickets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Tickets;');
    res.json(rows);
  } catch (err) {
    console.error('GET /tickets error:', err);
    res.status(500).send('Error fetching tickets');
  }
});

module.exports = router;
