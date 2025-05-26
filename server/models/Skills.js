// models/Skill.js


module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Skill.associate = (models) => {
    Skill.hasMany(models.UserSkill, { foreignKey: 'skill_id' });
};

  return Skill;
};