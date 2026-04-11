const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

// 1. Definisikan fungsi middleware untuk mengecek login
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/login');
};

// 2. Rute-rute Quest (Habit)
router.get('/add-habit', isAuthenticated, habitController.renderAddHabit);
router.post('/add-habit', isAuthenticated, habitController.addHabit);

router.post('/complete-habit/:id', isAuthenticated, habitController.completeHabit);
router.post('/delete-habit/:id', isAuthenticated, habitController.deleteHabit);

// 3. Rute Baru: History Logs
router.get('/history', isAuthenticated, habitController.getHistory);

module.exports = router;