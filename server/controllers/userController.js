const {
    Users,
    UserSkill,
    Projects,
    Experiences,
    Testimonials,
    Skill,
} = require("../models");
const uuid  = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
const ApiError = require("../Error/ApiError");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken"); // Імпортуємо jwt

class UserController {
    async SignUp(req, res, next) {
        const {
            first_name,
            last_name,
            username,
            email,
            password,
            avatar_url,
            bio,
        } = req.body;

        try {
            // Перевірка, чи існує користувач із таким username або email
            const existingUser = await Users.findOne({
                where: {
                    [Op.or]: [{ username }, { email }],
                },
            });

            if (existingUser) {
                return next(
                    ApiError.badRequest(
                        "Користувач із таким username або email уже існує"
                    )
                );
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
                bio,
            });

            res.status(200).json("User created");
        } catch (error) {
            next(ApiError.internalServerError("Помилка при створенні користувача"));
        }
    }

    async SignIn(req, res, next) {
        const { username, password } = req.body;

        try {
            const user = await Users.findOne({ where: { username } });
            if (!user) {
                return next(ApiError.unauthorized("Неправильний логін"));
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password_hash
            );
            if (!isPasswordValid) {
                return next(ApiError.unauthorized("Неправильний пароль"));
            }

            // Генерація JWT токена
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email }, // Дані, які будуть у токені
                process.env.JWT_SECRET, // Секретний ключ
                { expiresIn: "24h" } // Час дії токена
            );

            res.json({ token });
        } catch (error) {
            console.log(error);
            next(ApiError.internalServerError("Помилка при вході"));
        }
    }

    async Check(req, res, next) {
        const token = jwt.sign(
            { id: req.user.id, username: req.user.username, email: req.user.email }, // Дані, які будуть у токені
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        return res.json({ token });
    }

    async getProfile(req, res, next) {
        try {
            const user = await Users.findByPk(req.user.id, {
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "username",
                    "email",
                    "avatar_url",
                    "bio",
                ], // Вибір полів без password_hash
                include: [
                    {
                        model: UserSkill,
                        include: [
                            {
                                model: Skill, // Підтягування навичок через UserSkill
                                attributes: ["id", "name"],
                            },
                        ],
                        attributes: ["id", "proficiency"], // Підтягування рівня володіння навичкою
                    },
                    {
                        model: Projects,
                        attributes: [
                            "id",
                            "title",
                            "description",
                            "image_url",
                            "github_link",
                            "demo_link",
                        ],
                    },
                    {
                        model: Experiences,
                        attributes: [
                            "id",
                            "company",
                            "position",
                            "start_date",
                            "end_date",
                            "description",
                        ],
                    },
                    {
                        model: Testimonials,
                        attributes: ["id", "rating", "comment"],
                    },
                ],
            });

            if (!user) {
                return next(ApiError.notFound("Користувача не знайдено"));
            }

            res.json(user);
        } catch (error) {
            next(ApiError.internalServerError("Помилка при отриманні профілю"));
            console.log(error);
        }
    }

    async getPublicProfile(req, res, next) {
        try {
            const { username } = req.params;
            
            const user = await Users.findOne({
                where: { username },
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "username",
                    "avatar_url",
                    "bio",
                ],
                include: [
                    {
                        model: UserSkill,
                        include: [
                            {
                                model: Skill,
                                attributes: ["id", "name"],
                            },
                        ],
                        attributes: ["id", "proficiency"],
                    },
                    {
                        model: Projects,
                        attributes: [
                            "id",
                            "title",
                            "description",
                            "image_url",
                            "github_link",
                            "demo_link",
                        ],
                    },
                    {
                        model: Experiences,
                        attributes: [
                            "id",
                            "company",
                            "position",
                            "start_date",
                            "end_date",
                            "description",
                        ],
                    },
                    {
                        model: Testimonials,
                        attributes: ["id", "rating", "comment"],
                    },
                ],
            });

            if (!user) {
                return next(ApiError.notFound("Користувача не знайдено"));
            }

            res.json(user);
        } catch (error) {
            console.log(error);
            next(ApiError.internalServerError("Помилка при отриманні профілю"));
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { first_name, last_name, bio } = req.body;
            const { avatar_url } = req.files
            let avatar_path = uuid.v4() + ".jpg";
            avatar_url.mv(path.resolve(__dirname, "..", "static", avatar_path));
            // Перевірка, чи існує користувач
            const user = await Users.findByPk(req.user.id);
            if (!user) {
                return next(ApiError.notFound("Користувача не знайдено"));
            }

            // Оновлення базової інформації користувача
            await user.update({
                first_name: first_name || user.first_name,
                last_name: last_name || user.last_name,
                avatar_url: avatar_path || user.avatar_url,
                bio: bio || user.bio,
            });

            // Повертаємо оновлені дані користувача
            res.json({
                message: "Профіль успішно оновлено",
            });
        } catch (error) {
            console.log(error);
            next(ApiError.internalServerError("Помилка при оновленні профілю"));
        }
    }

    async searchUsers(req, res, next) {
        try {
            const { username, name, skill_id } = req.query;
            
            // Базові умови пошуку
            const whereConditions = {};
            const includeOptions = [];
            
            // Формуємо умови пошуку за username або ім'ям/прізвищем
            if (username || name) {
                const nameConditions = [];
                
                if (username) {
                    nameConditions.push({ 
                        username: { [Op.like]: `%${username}%` } 
                    });
                }
                
                if (name) {
                    nameConditions.push({ 
                        [Op.or]: [
                            { first_name: { [Op.like]: `%${name}%` } },
                            { last_name: { [Op.like]: `%${name}%` } }
                        ]
                    });
                }
                
                whereConditions[Op.or] = nameConditions;
            }
            
            // Налаштування для включення навичок
            const skillInclude = {
                model: UserSkill,
                include: [{
                    model: Skill,
                    attributes: ['id', 'name']
                }],
                attributes: ['id', 'proficiency']
            };
            
            // Якщо шукаємо за конкретною навичкою
            if (skill_id) {
                skillInclude.where = { skill_id };
            }
            
            includeOptions.push(skillInclude);
            
            // Включаємо проекти для відображення в результатах пошуку
            includeOptions.push({
                model: Projects,
                attributes: ['id', 'title', 'description', 'image_url'],
                limit: 3
            });
            
            // Виконання пошуку з обмеженням кількості результатів
            const users = await Users.findAll({
                where: whereConditions,
                attributes: ['id', 'username', 'first_name', 'last_name', 'avatar_url', 'bio'],
                include: includeOptions,
                limit: 20,
                order: [['first_name', 'ASC']]
            });
            
            res.json(users);
            
        } catch (error) {
            console.log(error);
            next(ApiError.internalServerError('Помилка при пошуку користувачів'));
        }
    }
}

module.exports = new UserController();
