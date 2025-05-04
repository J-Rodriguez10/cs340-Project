const express = require('express');
const db      = require('../database/db-connector');
const router  = express.Router();

// GET /customers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Customers;');
    res.json(rows);
  } catch (err) {
    console.error('GET /customers error:', err);
    res.status(500).send('Error fetching customers');
  }
});

module.exports = router;
