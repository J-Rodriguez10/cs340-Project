// ########################################
// ########## SETUP

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

// Replace with your actual port number (between 1025 and 65535)
const PORT = 32853;

// ########################################
// ########## ROUTE HANDLERS

// Handles any request not matched above by returning the index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// ########################################
// ########## LISTENER

app.listen(PORT, () => {
  console.log(`Frontend server running at http://classwork.engr.oregonstate.edu:${PORT}`);
});
