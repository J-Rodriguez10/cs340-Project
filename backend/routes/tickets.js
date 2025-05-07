const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

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

// POST /tickets
router.post('/', async (req, res) => {
  try {
    const { screeningID, customerID, purchaseDate, price } = req.body;
    
    if (!screeningID || !customerID || !purchaseDate || !price) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'INSERT INTO Tickets (screeningID, customerID, purchaseDate, price) VALUES (?, ?, ?, ?)',
      [screeningID, customerID, purchaseDate, price]
    );
    
    res.status(201).send({ 
      message: 'Ticket created successfully',
      id: result.insertId 
    });
  } catch (err) {
    console.error('POST /tickets error:', err);
    res.status(500).send('Error creating ticket');
  }
});

// DELETE /tickets/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Tickets WHERE ticketID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Ticket not found');
    }
    
    res.status(200).send({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('DELETE /tickets/:id error:', err);
    res.status(500).send('Error deleting ticket');
  }
});

// PUT /tickets/:id
router.put('/:id', async (req, res) => {
  try {
    const { screeningID, customerID, purchaseDate, price } = req.body;
    
    if (!screeningID || !customerID || !purchaseDate || !price) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'UPDATE Tickets SET screeningID = ?, customerID = ?, purchaseDate = ?, price = ? WHERE ticketID = ?',
      [screeningID, customerID, purchaseDate, price, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Ticket not found');
    }
    
    res.status(200).send({ message: 'Ticket updated successfully' });
  } catch (err) {
    console.error('PUT /tickets/:id error:', err);
    res.status(500).send('Error updating ticket');
  }
});

module.exports = router;
