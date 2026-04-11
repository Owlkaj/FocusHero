const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');


router.get('/admin', authController.isAdmin, adminController.renderAdminDashboard);
router.post('/admin/delete-user/:id', authController.isAdmin, adminController.deleteUser);
router.get('/admin/edit-user/:id', authController.isAdmin, adminController.renderEditUser);
router.post('/admin/edit-user/:id', authController.isAdmin, adminController.updateUser);
router.get('/admin/habits', authController.isAdmin, adminController.renderAllHabits);
router.post('/admin/delete-habit/:id', authController.isAdmin, adminController.deleteHabit);
router.get('/admin/user-habits/:id', authController.isAdmin, adminController.renderUserHabits);
router.post('/admin/user-habits/:id/add', authController.isAdmin, adminController.addHabitForUser);

module.exports = router;