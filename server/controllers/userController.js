const { Users } = require('../models');
const bcrypt = require('bcrypt');
const ApiError = require('../Error/ApiError');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken'); // Імпортуємо jwt

class UserController {
    async SignUp(req, res, next) {
        const { first_name, last_name, username, email, password, avatar_url, bio } = req.body;

        try {
            // Перевірка, чи існує користувач із таким username або email
            const existingUser = await Users.findOne({
                where: {
                    [Op.or]: [{ username }, { email }]
                }
            });

            if (existingUser) {
                return next(ApiError.badRequest('Користувач із таким username або email уже існує'));
            }

            // Хешування пароля та створення нового користувача
            const hash = await bcrypt.hash(password, 10);
            await Users.create({
                first_name,
                last_name,
                username,
                email,
                password_hash: hash,
                avatar_url,
                bio
            });

            res.status(200).json("User created");
        } catch (error) {
            next(ApiError.internalServerError('Помилка при створенні користувача'));
        }
    }

    async SignIn(req, res, next) {
        const { username, password } = req.body;

        try {
            const user = await Users.findOne({ where: { username } });
            if (!user) {
                return next(ApiError.unauthorized('Неправильний логін'));
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return next(ApiError.unauthorized('Неправильний пароль'));
            }

            // Генерація JWT токена
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email }, // Дані, які будуть у токені
                process.env.JWT_SECRET, // Секретний ключ
                { expiresIn: '24h' } // Час дії токена
            );

            res.json({token});
        } catch (error) {
            next(ApiError.internalServerError('Помилка при вході'));
        }
    }

    async Check(req, res, next) {
        const token = jwt.sign(
            { id: req.user.id, username: req.user.username, email: req.user.email }, // Дані, які будуть у токені
            process.env.JWT_SECRET, 
            { expiresIn: '24h' } 
        );
        return res.json({token});
    }
}

module.exports = new UserController();