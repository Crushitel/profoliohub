const express = require('express');
const router = express.Router();
const { Users } = require('../models'); // Import the User model
const bcrypt = require('bcrypt');

router.post("/register", async (req, res) => {
    const { first_name, last_name, username, email, password, avatar_url, bio } = req.body;
    bcrypt.hash(password, 10).then(async (hash) => {
        await Users.create({
            first_name,
            last_name,
            username,
            email,
            password_hash: hash,
            avatar_url,
            bio
        });
        res.json("User created");
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username } });
    if (!user) {
        return res.status(401).json({ error: "Неправильний логін" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Неправильний логін або пароль" });
    }
    res.json({ message: "Ти залогінився, братан" });
});

module.exports = router;