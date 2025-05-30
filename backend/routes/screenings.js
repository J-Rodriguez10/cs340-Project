const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /screenings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.screeningID,
        s.startTime,
        s.endTime,
        s.screenNumber,
        s.totalCapacity,
        CONCAT(s.employeeID, ' - ', e.firstName, ' ', e.lastName) AS employeeID,
        CONCAT(s.movieID, ' - ', m.title) AS movieID
      FROM Screenings s
      JOIN Movies m ON s.movieID = m.movieID
      JOIN Employees e ON s.employeeID = e.employeeID
      ORDER BY s.startTime;
    `);
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
      'CALL sp_AddScreening(?, ?, ?, ?, ?, ?)',
      [movieID, screenNumber, startTime, endTime, totalCapacity, employeeID]
    );

    res.status(201).send({
      message: 'Screening created successfully',
      id: result.insertId || null
    });
  } catch (err) {
    console.error('POST /screenings error:', err);
    res.status(500).send('Error creating screening');
  }
});


// DELETE /screenings/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'CALL sp_DeleteScreeningByID(?)',
      [req.params.id]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
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

    const [rows] = await db.query(
      'CALL sp_UpdateScreeningByID(?, ?, ?, ?, ?, ?, ?)',
      [req.params.id, movieID, screenNumber, startTime, endTime, totalCapacity, employeeID]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Screening not found');
    }

    res.status(200).send({ message: 'Screening updated successfully' });
  } catch (err) {
    console.error('PUT /screenings/:id error:', err);
    res.status(500).send('Error updating screening');
  }
});


// GET /screenings/options - For dropdowns: { value: screeningID, label: "ID - Movie Title @ Start Time" }
router.get('/options', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.screeningID AS value,
        CONCAT(s.screeningID, ' - ', m.title, ' @ ', DATE_FORMAT(s.startTime, '%Y-%m-%d %H:%i')) AS label
      FROM Screenings s
      JOIN Movies m ON s.movieID = m.movieID
      ORDER BY s.startTime;
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /screenings/options error:', err);
    res.status(500).send('Error fetching screening options');
  }
});


module.exports = router;