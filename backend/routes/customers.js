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
      'CALL sp_AddCustomer(?, ?, ?, ?)', 
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
    const [rows] = await db.query(
      'CALL sp_DeleteCustomerByID(?)', 
      [req.params.id]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
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

    const [rows] = await db.query(
      'CALL sp_UpdateCustomerByID(?, ?, ?, ?, ?)', 
      [req.params.id, firstName, lastName, email, phoneNumber]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Customer not found');
    }

    res.status(200).send({ message: 'Customer updated successfully' });
  } catch (err) {
    console.error('PUT /customers/:id error:', err);
    res.status(500).send('Error updating customer');
  }
});


/* 
  Citation for the following route handler:
  ChatGpt - Adapted from the template it gave.
  Prompt: Give me the template on how I would make an endpoint where the first value is
  the ID followed by the value of that ID.
*/
// GET /customers/options - For dropdowns: { value: customerID, label: "ID - First Last" }
router.get('/options', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        customerID AS value, 
        CONCAT(customerID, ' - ', firstName, ' ', lastName) AS label
      FROM Customers
      ORDER BY lastName ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /customers/options error:', err);
    res.status(500).send('Error fetching customer options');
  }
});


module.exports = router;
