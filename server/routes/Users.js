const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bcrypt = require('bcrypt');

router.post("/register", userController.SignUp);

router.post("/login", userController.SignIn);

module.exports = router;