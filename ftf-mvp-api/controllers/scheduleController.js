// controllers/scheduleController.js

const { Client } = require("@googlemaps/google-maps-services-js");
const { Pool } = require('pg');

// 1. Initialize Google Client using the correct environment variable
const googleClient = new Client({});

// 2. Initialize PostgreSQL Pool (using Railway's environment variables)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Railway connection
});

// Utility function to handle geocoding
const geocodeAddress = async (location) => {
    try {
        const response = await googleClient.geocode({
            params: {
                address: location,
                key: process.env.GOOGLE_GEOCODING_KEY, // <--- READS THE KEY HERE
            },
            timeout: 1000,
        });

        // Check if a result was found
        if (response.data.results.length === 0) {
            return null; // Geocode failed to find a location
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };

    } catch (error) {
        // Log the actual error on the server side (for debugging)
        console.error('Geocoding API Error:', error.message);
        return null; 
    }
};


// -----------------------------------------------------
// CONTROLLER FUNCTIONS
// -----------------------------------------------------

// Handles the POST /api/v1/schedules request
exports.createSchedule = async (req, res) => {
    const { title, date, time, location, social_link, menu_link } = req.body;

    // --- GEOCoding STEP ---
    const coordinates = await geocodeAddress(location);
    
    if (!coordinates) {
        // This is the error message that was incorrectly being thrown before
        return res.status(400).json({ message: "Could not geocode the provided location address. Check address formatting." });
    }
    
    const { latitude, longitude } = coordinates;
    
    // --- DATABASE INSERTION STEP ---
    const query = `
        INSERT INTO schedules (title, date, time, location, social_link, menu_link, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    
    const values = [title, date, time, location, social_link, menu_link, latitude, longitude];

    try {
        const result = await pool.query(query, values);
        // Respond with the newly created schedule data
        res.status(201).json(result.rows[0]); 
    } catch (dbError) {
        console.error('Database Insertion Error:', dbError.message);
        res.status(500).json({ message: "Error saving schedule to the database." });
    }
};

// Handles the GET /api/v1/schedules request
exports.getAllSchedules = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM schedules ORDER BY date, time;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database Query Error:', error.message);
        res.status(500).json({ message: "Error retrieving schedules." });
    }
};