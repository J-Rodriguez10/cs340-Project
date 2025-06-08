const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

/**
tickets.js, GenericList.jsx
* Date: June 8, 2025
Prompts used:
* "Help me reformat the table to show the purchase date as a date only, instead of a date and time."
 AI Source: https://claude.ai/new
*/

// GET /tickets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.ticketID,
        t.price,
        t.purchaseDate,
        CONCAT(t.customerID, ' - ', c.firstName, ' ', c.lastName) AS customerID,
        CONCAT(t.screeningID, ' - ', m.title, ' @ ', DATE_FORMAT(s.startTime, '%Y-%m-%d %H:%i')) AS screeningID
      FROM Tickets t
      JOIN Customers c ON t.customerID = c.customerID
      JOIN Screenings s ON t.screeningID = s.screeningID
      JOIN Movies m ON s.movieID = m.movieID
      ORDER BY t.ticketID;
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /tickets error:', err);
    res.status(500).send('Error fetching tickets');
  }
});


// POST /tickets
router.post('/', async (req, res) => {
  try {
    const { screeningID, customerID, price } = req.body;

    if (!screeningID || !customerID || !price) {
      return res.status(400).send('Missing required fields');
    }

    // Automatically sets the purchaseDate to current date/time
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const [result] = await db.query(
      'CALL sp_AddTicket(?, ?, ?, ?)',
      [screeningID, customerID, currentDateTime, price]
    );

    res.status(201).send({
      message: 'Ticket created successfully',
      id: result.insertId || null
    });
  } catch (err) {
    console.error('POST /tickets error:', err);
    res.status(500).send('Error creating ticket');
  }
});


// DELETE /tickets/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'CALL sp_DeleteTicketByID(?)',
      [req.params.id]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
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

    // Allows for the editing/updating of purchaseDate
    let finalDateTime = purchaseDate;
    // Handle different datetime formats if needed
    if (purchaseDate.includes('T') && !purchaseDate.includes(' ')) {
      finalDateTime = purchaseDate.slice(0, 19).replace('T', ' ');
    }

    const [rows] = await db.query(
      'CALL sp_UpdateTicketByID(?, ?, ?, ?, ?)',
      [req.params.id, screeningID, customerID, finalDateTime, price]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Ticket not found');
    }

    res.status(200).send({ message: 'Ticket updated successfully' });
  } catch (err) {
    console.error('PUT /tickets/:id error:', err);
    res.status(500).send('Error updating ticket');
  }
});


module.exports = router;
