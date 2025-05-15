const nodemailer = require('nodemailer');

// Налаштування транспорту для відправки листів
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_app_password',
  },
});

// Функція для відправки листа для відновлення пароля
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"ProfolioHub" <support@profoliohub.com>',
    to: email,
    subject: 'Відновлення пароля на ProfolioHub',
    html: `
      <h1>Відновлення пароля</h1>
      <p>Ви отримали цей лист, оскільки запросили відновлення пароля на ProfolioHub.</p>
      <p>Будь ласка, перейдіть за посиланням нижче для встановлення нового пароля:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Посилання дійсне протягом 1 години.</p>
      <p>Якщо ви не запитували відновлення пароля, проігноруйте цей лист.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail
};