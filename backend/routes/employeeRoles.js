const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /employeeRoles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM EmployeeRoles ORDER BY roleID ASC;'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /employeeRoles error:', err);
    res.status(500).send('Error fetching employee roles');
  }
});

// POST /employeeRoles
router.post('/', async (req, res) => {
  try {
    const { roleName } = req.body;
    
    if (!roleName) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'INSERT INTO EmployeeRoles (roleName) VALUES (?)',
      [roleName]
    );
    
    res.status(201).send({ 
      message: 'Employee role created successfully',
      id: result.insertId 
    });
  } catch (err) {
    console.error('POST /employeeRoles error:', err);
    res.status(500).send('Error creating employee role');
  }
});

// DELETE /employeeRoles/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM EmployeeRoles WHERE roleID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Employee role not found');
    }
    
    res.status(200).send({ message: 'Employee role deleted successfully' });
  } catch (err) {
    console.error('DELETE /employeeRoles/:id error:', err);
    res.status(500).send('Error deleting employee role');
  }
});

// PUT /employeeRoles/:id
router.put('/:id', async (req, res) => {
  try {
    const { roleName } = req.body;
    
    if (!roleName) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'UPDATE EmployeeRoles SET roleName = ? WHERE roleID = ?',
      [roleName, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Employee role not found');
    }
    
    res.status(200).send({ message: 'Employee role updated successfully' });
  } catch (err) {
    console.error('PUT /employeeRoles/:id error:', err);
    res.status(500).send('Error updating employee role');
  }
});

// GET /employeeRoles/options - For dropdowns: { value: roleID, label: "ID - Role Name" }
router.get('/options', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        roleID AS value,
        CONCAT(roleID, ' - ', roleName) AS label
      FROM EmployeeRoles
      ORDER BY roleName ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /employeeRoles/options error:', err);
    res.status(500).send('Error fetching employee role options');
  }
});

module.exports = router;
