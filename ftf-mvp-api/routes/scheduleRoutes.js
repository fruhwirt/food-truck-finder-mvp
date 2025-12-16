// routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const { Client: MapsClient } = require('@googlemaps/google-maps-services-js');

// Initialize Database Client - Optimized for Railway's DATABASE_URL environment variable
const db = new Client({
    // If DATABASE_URL is present (on Railway), use it. Otherwise, fallback to individual PG variables.
    connectionString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Required for secure cloud DB connections
});
db.connect().catch(err => {
    console.error("Failed to connect to the database. Check connection variables.", err);
});

// Initialize Google Maps Client for Geocoding
const mapsClient = new MapsClient({});
const MAPS_API_KEY = process.env.GOOGLE_GEOCODING_KEY;
const mapsClient = new MapsClient({
    key: MAPS_API_KEY // <--- THIS IS THE MISSING PIECE!
});


// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
    const today = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

// --- A. GET /schedules (Public Data Fetching) ---
router.get('/schedules', async (req, res) => {
    let targetDate = req.query.date;

    // Default to Today if no date is provided
    if (!targetDate) {
        targetDate = getTodayDateString();
    }
    
    try {
        const query = `
            SELECT 
                id, title, time, latitude, longitude, social_link, menu_link, date, location
            FROM schedules 
            WHERE date = $1;
        `;
        
        const result = await db.query(query, [targetDate]);
        
        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Schedule fetching error:", error);
        res.status(500).json({ message: "An internal server error occurred while fetching schedules." });
    }
});


// Helper function to call the Geocoding API
async function geocodeAddress(address) {
    if (!MAPS_API_KEY) throw new Error("Google Geocoding API Key not configured.");
    
    try {
        const response = await mapsClient.geocode({
            params: {
                address: address,
                key: MAPS_API_KEY,
            },
        });
        
        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                latitude: location.lat,
                longitude: location.lng
            };
        }
    } catch (error) {
        // Log the exact error from Google for debugging
        console.error(`Geocoding API call failed:`, error.message);
    }
    return null; 
}


// --- B. POST /schedules (Single Schedule Creation/Vendor Entry) ---
router.post('/schedules', async (req, res) => {
    // The frontend mock form sends these fields
    const { title, date, time, location, social_link, menu_link } = req.body;

    // 1. Validation (CRITICAL FIELDS)
    if (!title || !date || !time || !location || !social_link) {
        return res.status(400).json({ message: "Missing required fields: title, date, time, location, social_link." });
    }

    try {
        // 2. Geocoding (MANDATORY STEP)
        const geocodeResult = await geocodeAddress(location);

        if (!geocodeResult) {
            // This error means the address couldn't be resolved by Google
            return res.status(400).json({ message: "Could not geocode the provided location address. Check address formatting." });
        }

        const { latitude, longitude } = geocodeResult;

        // 3. Database Insertion
        const query = `
            INSERT INTO schedules (
                title, date, time, location, social_link, menu_link, latitude, longitude
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        
        const values = [
            title, date, time, location, social_link, menu_link || null, latitude, longitude
        ];

        const result = await db.query(query, values); 
        
        // 4. Success Response
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Schedule creation error:", error);
        // Specifically check for database connection issues here
        if (error.code === 'ECONNREFUSED' || error.code === '42P01') { 
            return res.status(500).json({ message: "Database connection or table error. Check Railway logs/schema." });
        }
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

module.exports = router;