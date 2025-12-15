// server.js
require('dotenv').config(); 
const express = require('express');
const scheduleRouter = require('./routes/scheduleRoutes');
const cors = require('cors'); // 1. IMPORT CORS HERE

const app = express();
const PORT = process.env.PORT || 3001;

// --- CORS CONFIGURATION (MUST BE NEAR THE TOP) ---
// Your specific Vercel URL and the wildcard for preview deployments.
const allowedOrigins = [
  'https://ftf-mvp-frontend-6bxn.vercel.app', 
  'https://*.vercel.app'                     
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allows requests with no origin (like mobile apps) or from the allowed list
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(pattern => {
         // Simple wildcard matching for Vercel previews
         return pattern.includes('*') && origin.endsWith(pattern.substring(1));
    })) {
      callback(null, true);
    } else {
      // The error message the server sends when blocked
      callback(new Error('Not allowed by CORS')); 
    }
  }
};
app.use(cors(corsOptions)); // 2. USE CORS MIDDLEWARE
// --------------------------

// Middleware (The rest of your original middleware)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', scheduleRouter); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});