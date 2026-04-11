const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Jika ada yang mengakses /login, panggil controller renderLogin
router.get('/login', authController.renderLogin);

// Jika ada yang mengakses /register, panggil controller renderRegister
router.get('/register', authController.renderRegister);

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;