const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /screenings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Screenings;');
    res.json(rows);
  } catch (err) {
    console.error('GET /screenings error:', err);
    res.status(500).send('Error fetching screenings');
  }
});

// POST /screenings
router.post('/', async (req, res) => {
  try {
    const { movieID, screenNumber, startTime, endTime, totalCapacity, employeeID } = req.body;
    
    if (!movieID || !screenNumber || !startTime || !totalCapacity || !employeeID) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'INSERT INTO Screenings (movieID, screenNumber, startTime, endTime, totalCapacity, employeeID) VALUES (?, ?, ?, ?, ?, ?)',
      [movieID, screenNumber, startTime, endTime, totalCapacity, employeeID]
    );
    
    res.status(201).send({ 
      message: 'Screening created successfully',
      id: result.insertId 
    });
  } catch (err) {
    console.error('POST /screenings error:', err);
    res.status(500).send('Error creating screening');
  }
});

// DELETE /screenings/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Screenings WHERE screeningID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Screening not found');
    }
    
    res.status(200).send({ message: 'Screening deleted successfully' });
  } catch (err) {
    console.error('DELETE /screenings/:id error:', err);
    res.status(500).send('Error deleting screening');
  }
});

// PUT /screenings/:id
router.put('/:id', async (req, res) => {
  try {
    const { movieID, screenNumber, startTime, endTime, totalCapacity, employeeID } = req.body;
    
    if (!movieID || !screenNumber || !startTime || !totalCapacity || !employeeID) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'UPDATE Screenings SET movieID = ?, screenNumber = ?, startTime = ?, endTime = ?, totalCapacity = ?, employeeID = ? WHERE screeningID = ?',
      [movieID, screenNumber, startTime, endTime, totalCapacity, employeeID, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Screening not found');
    }
    
    res.status(200).send({ message: 'Screening updated successfully' });
  } catch (err) {
    console.error('PUT /screenings/:id error:', err);
    res.status(500).send('Error updating screening');
  }
});

module.exports = router;