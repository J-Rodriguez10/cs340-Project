
// ########################################
// ########## SETUP

const express = require('express');
const path = require('path');
const app = express();

// Debug logging to help troubleshoot
console.log(`Current directory: ${__dirname}`);
console.log(`Looking for dist at: ${path.join(__dirname, 'dist')}`);

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

const PORT = 32829;

// Middleware to handle all requests that don't match static files
app.use(function(req, res) {
  console.log(`Handling request for: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at: http://classwork.engr.oregonstate.edu:${PORT}`);
});