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

// POST /movies
router.post('/', async (req, res) => {
  try {
    const { title, director, releaseYear, genre, runtime, rating } = req.body;
    
    if (!title) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'INSERT INTO Movies (title, director, releaseYear, genre, runtime, rating) VALUES (?, ?, ?, ?, ?, ?)',
      [title, director, releaseYear, genre, runtime, rating]
    );
    
    res.status(201).send({ 
      message: 'Movie created successfully',
      id: result.insertId 
    });
  } catch (err) {
    console.error('POST /movies error:', err);
    res.status(500).send('Error creating movie');
  }
});

// DELETE /movies/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Movies WHERE movieID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Movie not found');
    }
    
    res.status(200).send({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('DELETE /movies/:id error:', err);
    res.status(500).send('Error deleting movie');
  }
});

// PUT /movies/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, director, releaseYear, genre, runtime, rating } = req.body;
    
    if (!title) {
      return res.status(400).send('Missing required fields');
    }
    
    const [result] = await db.query(
      'UPDATE Movies SET title = ?, director = ?, releaseYear = ?, genre = ?, runtime = ?, rating = ? WHERE movieID = ?',
      [title, director, releaseYear, genre, runtime, rating, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Movie not found');
    }
    
    res.status(200).send({ message: 'Movie updated successfully' });
  } catch (err) {
    console.error('PUT /movies/:id error:', err);
    res.status(500).send('Error updating movie');
  }
});


// GET /movies/options - For dropdowns: { value: movieID, label: "ID - Title" }
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


module.exports = router;