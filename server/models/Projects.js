

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    github_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    demo_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    }, {
    timestamps: true,
    });

    Project.associate = (models) => {
    Project.belongsTo(models.Users, { foreignKey: 'user_id' });
    };

    return Project;
};