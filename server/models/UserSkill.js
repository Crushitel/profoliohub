// models/UserSkill.js


module.exports = (sequelize, DataTypes) => {
  const UserSkill = sequelize.define('UserSkill', {
    proficiency: {
      type: DataTypes.INTEGER, // Заміна ENUM на INTEGER
      allowNull: false,
      validate: {
        min: 0,    // Мінімальне значення: 0%
        max: 100,  // Максимальне значення: 100%
      },
    },
  });

  // Зв'язки з User та Skill
  UserSkill.associate = (models) => {
    UserSkill.belongsTo(models.Users, { foreignKey: 'user_id' });
    UserSkill.belongsTo(models.Skill, { foreignKey: 'skill_id' });
  };

  return UserSkill;
};