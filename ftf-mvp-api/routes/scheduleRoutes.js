const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// GET all schedules
router.get('/', scheduleController.getAllSchedules);

// POST a new schedule
router.post('/', scheduleController.createSchedule);

module.exports = router;