const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');
const bcrypt = require('bcrypt');

router.post("/register", userController.SignUp);

router.post("/login", userController.SignIn);

router.get("/autorize", authMiddleware, userController.Check);

router.get('/profile', authMiddleware, userController.getProfile);

router.put('/profile', authMiddleware, userController.updateProfile);

router.get('/search', userController.searchUsers);

router.get('/public/:username', userController.getPublicProfile);

router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/change-password', authMiddleware, userController.changePassword);

module.exports = router;