const express = require('express');
const db      = require('../database/db-connector');
const router  = express.Router();

// GET /employeeRoles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM EmployeeRoles;');
    res.json(rows);
  } catch (err) {
    console.error('GET /employeeRoles error:', err);
    res.status(500).send('Error fetching employee roles');
  }
});

module.exports = router;
