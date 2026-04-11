const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.renderHome);
router.get('/leaderboard', pageController.renderLeaderboard);

module.exports = router;