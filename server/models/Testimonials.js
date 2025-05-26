// models/Review.js

module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define('Testimonial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: { // ID користувача, якому залишили відгук
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    author_id: { // ID користувача, який залишив відгук
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
  });

  Testimonial.associate = (models) => {
    // Користувач, якому залишили відгук
    Testimonial.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'UserProfile', // Або інший аліас, якщо використовується
    });
    // Автор відгуку
    Testimonial.belongsTo(models.Users, {
      foreignKey: 'author_id',
      as: 'Author', // Цей аліас важливий для отримання даних автора
    });
  };

  return Testimonial;
};