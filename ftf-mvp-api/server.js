// server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const scheduleRouter = require('./routes/scheduleRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// API Routes
// All routes defined in scheduleRoutes.js will be prefixed with /api/v1
app.use('/api/v1', scheduleRouter); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});