const {
  Users,
  UserSkill,
  Projects,
  Experiences,
  Testimonial,
  Skill,
  sequelize,
} = require("../models");
const uuid = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
const ApiError = require("../Error/ApiError");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken"); // Імпортуємо jwt
const { sendPasswordResetEmail } = require('../service/mail-service'); 

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
      const user = await Users.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password_hash"] },
        include: [
          {
            model: UserSkill,
            include: [{ model: Skill, attributes: ["id", "name"] }],
          },
          { model: Projects },
          { model: Experiences },
          {
            model: Testimonial,
            as: "TestimonialsReceived",
            include: [
              {
                model: Users,
                as: "Author",
                attributes: [
                  "id",
                  "first_name",
                  "last_name",
                  "username",
                  "avatar_url",
                ],
              },
            ],
            attributes: ["id", "rating", "comment", "createdAt"],
          },
        ],
        order: [
          [Experiences, "start_date", "DESC"],
          [Projects, "createdAt", "DESC"],
          [
            { model: Testimonial, as: "TestimonialsReceived" },
            "createdAt",
            "DESC",
          ],
        ],
      });
      if (!user) {
        return next(ApiError.notFound("Користувача не знайдено"));
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      next(ApiError.internalServerError("Помилка при отриманні профілю"));
    }
  }

  async getPublicProfile(req, res, next) {
    try {
      const { username } = req.params;

      const user = await Users.findOne({
        where: { username },
        attributes: { exclude: ["password_hash"] },
        include: [
          {
            model: UserSkill,
            include: [{ model: Skill, attributes: ["id", "name"] }],
          },
          { model: Projects },
          { model: Experiences },
          {
            model: Testimonial,
            as: "TestimonialsReceived",
            include: [
              {
                model: Users,
                as: "Author",
                attributes: [
                  "id",
                  "first_name",
                  "last_name",
                  "username",
                  "avatar_url",
                ],
              },
            ],
            attributes: ["id", "rating", "comment", "createdAt"],
          },
        ],
        order: [
          [Experiences, "start_date", "DESC"],
          [Projects, "createdAt", "DESC"],
          [
            { model: Testimonial, as: "TestimonialsReceived" },
            "createdAt",
            "DESC",
          ],
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
      const { first_name, last_name, bio, email, username } = req.body;
      let avatar_path = null;

      // Перевірка, чи існує користувач
      const user = await Users.findByPk(req.user.id);
      if (!user) {
        return next(ApiError.notFound("Користувача не знайдено"));
      }

      // Перевіряємо, чи є файл avatar_url в запиті
      if (req.files && req.files.avatar_url) {
        const avatar_url = req.files.avatar_url;
        avatar_path = uuid.v4() + path.extname(avatar_url.name);
        avatar_url.mv(path.resolve(__dirname, "..", "static", avatar_path));
      }

      // Якщо email змінився, перевіряємо чи він унікальний
      if (email && email !== user.email) {
        const existingUserWithEmail = await Users.findOne({
          where: { email },
        });

        if (existingUserWithEmail) {
          return next(
            ApiError.badRequest("Користувач з таким email вже існує")
          );
        }
      }

      // Якщо username змінився, перевіряємо чи він унікальний
      if (username && username !== user.username) {
        const existingUserWithUsername = await Users.findOne({
          where: { username },
        });

        if (existingUserWithUsername) {
          return next(
            ApiError.badRequest("Користувач з таким username вже існує")
          );
        }
      }

      // Оновлення базової інформації користувача
      await user.update({
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        avatar_url: avatar_path || user.avatar_url,
        bio: bio || user.bio,
        email: email || user.email,
        username: username || user.username, // Додано оновлення username
      });

      // Повертаємо оновлені дані користувача
      res.json({
        message: "Профіль успішно оновлено",
        avatar_url: avatar_path || user.avatar_url,
        username: username || user.username, // Повертаємо оновлений username
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
            username: { [Op.like]: `%${username}%` },
          });
        }

        if (name) {
          nameConditions.push({
            [Op.or]: [
              { first_name: { [Op.like]: `%${name}%` } },
              { last_name: { [Op.like]: `%${name}%` } },
            ],
          });
        }

        whereConditions[Op.or] = nameConditions;
      }

      // Налаштування для включення навичок
      const skillInclude = {
        model: UserSkill,
        include: [
          {
            model: Skill,
            attributes: ["id", "name"],
          },
        ],
        attributes: ["id", "proficiency"],
      };

      // Якщо шукаємо за конкретною навичкою
      if (skill_id) {
        skillInclude.where = { skill_id };
      }

      includeOptions.push(skillInclude);

      // Включаємо проекти для відображення в результатах пошуку
      includeOptions.push({
        model: Projects,
        attributes: ["id", "title", "description", "image_url"],
        limit: 3,
      });

      // Виконання пошуку з обмеженням кількості результатів
      const users = await Users.findAll({
        where: whereConditions,
        attributes: [
          "id",
          "username",
          "first_name",
          "last_name",
          "avatar_url",
          "bio",
        ],
        include: includeOptions,
        limit: 20,
        order: [["first_name", "ASC"]],
      });

      res.json(users);
    } catch (error) {
      console.log(error);
      next(ApiError.internalServerError("Помилка при пошуку користувачів"));
    }
  }

  // Запит на відновлення пароля
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // Перевірка наявності користувача з таким email
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.notFound("Користувача з такою електронною поштою не знайдено"));
      }

      // Генерація токена відновлення
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Токен дійсний 1 годину
      );

      // Відправка токена через email
      await sendPasswordResetEmail(email, resetToken);
      
      res.json({
        message: "Інструкції для відновлення пароля надіслано на вашу електронну пошту"
        // Тепер ми не повертаємо resetToken у відповіді
      });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      next(ApiError.internalServerError("Помилка при обробці запиту на відновлення пароля"));
    }
  }

  // Скидання пароля за токеном
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      // Перевірка валідності токена
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return next(ApiError.unauthorized("Недійсний або прострочений токен"));
      }

      // Пошук користувача
      const user = await Users.findByPk(decoded.id);
      if (!user) {
        return next(ApiError.notFound("Користувача не знайдено"));
      }

      // Хешування та оновлення пароля
      const hash = await bcrypt.hash(newPassword, 10);
      await user.update({ password_hash: hash });

      res.json({ message: "Пароль успішно змінено" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      next(ApiError.internalServerError("Помилка при зміні пароля"));
    }
  }

  // Зміна пароля аутентифікованого користувача
  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // Перевірка, чи існує користувач
      const user = await Users.findByPk(userId);
      if (!user) {
        return next(ApiError.notFound("Користувача не знайдено"));
      }
      
      // Перевірка поточного пароля
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );
      
      if (!isPasswordValid) {
        return next(ApiError.badRequest("Неправильний поточний пароль"));
      }
      
      // Хешування та оновлення пароля
      const hash = await bcrypt.hash(newPassword, 10);
      await user.update({ password_hash: hash });
      
      res.json({ message: "Пароль успішно змінено" });
    } catch (error) {
      console.error("Error in changePassword:", error);
      next(ApiError.internalServerError("Помилка при зміні пароля"));
    }
  }
}

module.exports = new UserController();
