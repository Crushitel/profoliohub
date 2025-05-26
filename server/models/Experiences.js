

module.exports = (sequelize, DataTypes) => {
  const Experiences = sequelize.define('Experiences', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    });

  // Зв'язок з User
    Experiences.associate = (models) => {
    Experiences.belongsTo(models.Users, { foreignKey: 'user_id' });
    };

    return Experiences;
};