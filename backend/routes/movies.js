const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /movies
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Movies;');
    res.json(rows);
  } catch (err) {
    console.error('GET /movies error:', err);
    res.status(500).send('Error fetching movies');
  }
});

/* 
  Citation for the following route handler:
  ChatGpt - Adapted from the template it gave.
  Prompt: Give me the template on how I would make an endpoint where the first value is
  the ID followed by the value of that ID.
*/
// GET /movies/options
router.get('/options', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        movieID AS value, 
        CONCAT(movieID, ' - ', title) AS label
      FROM Movies
      ORDER BY title ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /movies/options error:', err);
    res.status(500).send('Error fetching movie options');
  }
});

// GET /movies/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Movies WHERE movieID = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).send('Movie not found');
    }
    
    res.json(rows[0]); // Return the single movie object
  } catch (err) {
    console.error('GET /movies/:id error:', err);
    res.status(500).send('Error fetching movie details');
  }
});

// POST /movies
router.post('/', async (req, res) => {
  try {
    const { title, director, releaseYear, genre, runtime, rating } = req.body;

    if (!title) {
      return res.status(400).send('Missing required fields');
    }

    const [result] = await db.query(
      'CALL sp_AddMovie(?, ?, ?, ?, ?, ?)',
      [title, director, releaseYear, genre, runtime, rating]
    );

    res.status(201).send({ 
      message: 'Movie created successfully',
      id: result.insertId || null
    });
  } catch (err) {
    console.error('POST /movies error:', err);
    res.status(500).send('Error creating movie');
  }
});

// PUT /movies/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, director, releaseYear, genre, runtime, rating } = req.body;

    if (!title) {
      return res.status(400).send('Missing required fields');
    }

    const [rows] = await db.query(
      'CALL sp_UpdateMovieByID(?, ?, ?, ?, ?, ?, ?)',
      [req.params.id, title, director, releaseYear, genre, runtime, rating]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Movie not found');
    }

    res.status(200).send({ message: 'Movie updated successfully' });
  } catch (err) {
    console.error('PUT /movies/:id error:', err);
    res.status(500).send('Error updating movie');
  }
});

// DELETE /movies/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'CALL sp_DeleteMovieByID(?)',
      [req.params.id]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Movie not found');
    }

    res.status(200).send({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('DELETE /movies/:id error:', err);
    res.status(500).send('Error deleting movie');
  }
});

module.exports = router;