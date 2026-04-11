const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

router.get('/add-habit', habitController.renderAddHabit);
router.post('/add-habit', habitController.addHabit);

router.post('/complete-habit/:id', habitController.completeHabit);
router.post('/delete-habit/:id', habitController.deleteHabit);

module.exports = router;