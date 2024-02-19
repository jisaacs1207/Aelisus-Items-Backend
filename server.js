// Import the 'express' module
const express = require('express');
// Create an Express application
const app = express();
// Define the port number
const port = 4000;
// Import parsedData object from the 'app.js' file
const { parsedData } = require('./app.js');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to fetch parsed data
app.get('/parsedData', (req, res) => {
    // Send parsed data as JSON response
    res.json(parsedData);
});

// Start the Express server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
