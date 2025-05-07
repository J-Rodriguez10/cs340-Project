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

// POST /employees
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, roleID } = req.body;
    
    if (!firstName || !lastName || !roleID) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'INSERT INTO Employees (firstName, lastName, email, phoneNumber, roleID) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phoneNumber, roleID]
    );
    
    res.status(201).send({ 
      message: 'Employee created successfully',
      id: result.insertId 
    });
  } catch (err) {
    console.error('POST /employees error:', err);
    res.status(500).send('Error creating employee');
  }
});

// DELETE /employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Employees WHERE employeeID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Employee not found');
    }
    
    res.status(200).send({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('DELETE /employees/:id error:', err);
    res.status(500).send('Error deleting employee');
  }
});

// PUT /employees/:id
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, roleID } = req.body;
    
    if (!firstName || !lastName || !roleID) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'UPDATE Employees SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, roleID = ? WHERE employeeID = ?',
      [firstName, lastName, email, phoneNumber, roleID, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Employee not found');
    }
    
    res.status(200).send({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('PUT /employees/:id error:', err);
    res.status(500).send('Error updating employee');
  }
});

module.exports = router;
