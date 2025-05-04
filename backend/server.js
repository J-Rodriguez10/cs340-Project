// ########################################
// ########## SETUP

const db = require('./database/db-connector');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

const PORT = 32851; // Replace with your chosen backend port

// ########################################
// ########## ROUTE HANDLERS

app.get('/', (req, res) => {
  res.send('Backend is working!!!! - Jesus and Julio');
});

// app.get('/bsg-people', async (req, res) => {
//   try {
//     const query1 = `
//       SELECT bsg_people.id, bsg_people.fname, bsg_people.lname,
//              bsg_planets.name AS homeworld, bsg_people.age
//       FROM bsg_people
//       LEFT JOIN bsg_planets ON bsg_people.homeworld = bsg_planets.id;`;

//     const query2 = 'SELECT * FROM bsg_planets;';

//     const [people] = await db.query(query1);
//     const [homeworlds] = await db.query(query2);

//     res.status(200).json({ people, homeworlds });

//   } catch (error) {
//     console.error("Error executing queries:", error);
//     res.status(500).send("An error occurred while executing the database queries.");
//   }
// });

// ########################################
// ########## LISTENER

app.listen(PORT, () => {
  console.log(`Express started on http://classwork.engr.oregonstate.edu:${PORT}`);
});
