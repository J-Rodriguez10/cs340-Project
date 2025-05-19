// ########################################
// ########## SETUP
require('dotenv').config()
const db = require('./database/db-connector');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

 // Replace with your chosen backend port
const PORT = 32849;

// ########################################
// ########## ROUTE HANDLERS


// Simple test endpoint to check if everything is ok:
app.get('/', (req, res) => {
  res.send('Backend is finally working!!!! - Jesus and Julio');
});

// ########################################
// ########## JOINING THE HELPER ROUTES INTO THE MAIN SERVER FILE

app.use('/movies', require('./routes/movies'));
app.use('/screenings', require('./routes/screenings'));
app.use('/tickets', require('./routes/tickets'));
app.use('/customers', require('./routes/customers'));
app.use('/employees', require('./routes/employees'));
app.use('/employeeRoles', require('./routes/employeeRoles'));



// ########## RESET PROCEDURE CALL
app.get('/reset-db', async (req, res) => {
  try {
    await db.query('CALL sp_ResetDatabase();');
    res.status(200).send('Database has been reset successfully.');
  } catch (err) {
    console.error('Error executing sp_ResetDatabase:', err);
    res.status(500).send('An error occurred while resetting the database.');
  }
});

// ########## LISTENER
app.listen(PORT, () => {
  console.log(`Express started on: http://classwork.engr.oregonstate.edu:${PORT}`);
});

