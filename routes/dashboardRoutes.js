const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Jalur menuju Dashboard
router.get('/dashboard', dashboardController.renderDashboard);

// Jalur untuk Logout
router.get('/logout', dashboardController.logoutUser);

module.exports = router;