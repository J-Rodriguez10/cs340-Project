const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

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

// POST /customers
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'INSERT INTO Customers (firstName, lastName, email, phoneNumber) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, phoneNumber]
    );
    
    res.status(201).send({ 
      message: 'Customer created successfully',
      id: result.insertId 
    });
  } catch (err) {
    console.error('POST /customers error:', err);
    res.status(500).send('Error creating customer');
  }
});

// DELETE /customers/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Customers WHERE customerID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Customer not found');
    }
    
    res.status(200).send({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('DELETE /customers/:id error:', err);
    res.status(500).send('Error deleting customer');
  }
});

// PUT /customers/:id
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'UPDATE Customers SET firstName = ?, lastName = ?, email = ?, phoneNumber = ? WHERE customerID = ?',
      [firstName, lastName, email, phoneNumber, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Customer not found');
    }
    
    res.status(200).send({ message: 'Customer updated successfully' });
  } catch (err) {
    console.error('PUT /customers/:id error:', err);
    res.status(500).send('Error updating customer');
  }
});

module.exports = router;
