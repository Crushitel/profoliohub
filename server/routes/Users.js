const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');
const bcrypt = require('bcrypt');

router.post("/register", userController.SignUp);

router.post("/login", userController.SignIn);

router.get("/autorize", authMiddleware, userController.Check);


module.exports = router;