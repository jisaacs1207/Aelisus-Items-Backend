// Import required modules
const csv = require('csv-parser'); // Module for parsing CSV files
const fs = require('fs'); // File system module for reading files
const path = require('path'); // Module for handling file paths
const cron = require('node-cron'); // Module for scheduling tasks

// Initialize object to store parsed data from CSV files
let parsedData = {
    armor: [], // Array to store parsed data from 'armor.csv'
    weapons: [], // Array to store parsed data from 'weapons.csv'
    consumables: [] // Array to store parsed data from 'consumables.csv'
};

// Function to parse CSV files and populate 'parsedData' object
function parseCSVFiles() {
    // Clear existing data arrays
    parsedData.armor = [];
    parsedData.weapons = [];
    parsedData.consumables = [];

    // Function to filter out rows with "Limbo" in the area column
    function filterLimbo(row) {
        return row && row.area !== 'Limbo'; // Exclude rows where the area is "Limbo"
    }

    // Function to preprocess the "short" column and remove '`' character and the next character
    function preprocessShort(row) {
        if (row.short && row.short.includes('`')) { // Check if the "short" column contains '`' character
            row.short = row.short.replace(/`.?/g, ''); // Replace '`' character and the next character
        }
        return row;
    }

    // Parse 'armor.csv' file
    fs.createReadStream(path.join(__dirname, 'csv', 'armor.csv')) // Read 'armor.csv' file
        .pipe(csv()) // Pipe the file stream to the CSV parser
        .on('data', (row) => { // Event listener for each row of data parsed
            if (filterLimbo(row)) {
                parsedData.armor.push(preprocessShort(row)); // Push parsed row (after preprocessing) to 'armor' data array
            }
        })
        .on('end', () => {}); // Event listener for end of file stream

    // Parse 'weapons.csv' file
    fs.createReadStream(path.join(__dirname, 'csv', 'weapons.csv')) // Read 'weapons.csv' file
        .pipe(csv()) // Pipe the file stream to the CSV parser
        .on('data', (row) => { // Event listener for each row of data parsed
            if (filterLimbo(row)) {
                parsedData.weapons.push(preprocessShort(row)); // Push parsed row (after preprocessing) to 'weapons' data array
            }
        })
        .on('end', () => {}); // Event listener for end of file stream

    // Parse 'consumables.csv' file
    fs.createReadStream(path.join(__dirname, 'csv', 'consumables.csv')) // Read 'consumables.csv' file
        .pipe(csv()) // Pipe the file stream to the CSV parser
        .on('data', (row) => { // Event listener for each row of data parsed
            if (filterLimbo(row)) {
                parsedData.consumables.push(preprocessShort(row)); // Push parsed row (after preprocessing) to 'consumables' data array
            }
        })
        .on('end', () => {}); // Event listener for end of file stream
}

// Function to update parsed data periodically using cron job
function updateParsedData() {
    parseCSVFiles(); // Parse CSV files and update 'parsedData' object
}

// Schedule cron job to update parsed data every 5 minutes
cron.schedule('*/5 * * * *', () => { // Schedule cron job using 'node-cron' module
    updateParsedData(); // Call function to update parsed data
});

// Parse CSV files and populate 'parsedData' object initially
parseCSVFiles();

// Export 'parsedData' object to make it accessible in other modules
module.exports = { parsedData };
