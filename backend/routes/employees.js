const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /employees
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Employees;');
    res.json(rows);
  } catch (err) {
    console.error('GET /employees error:', err);
    res.status(500).send('Error fetching employees');
  }
});

module.exports = router;
