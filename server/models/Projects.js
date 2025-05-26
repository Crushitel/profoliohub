

module.exports = (sequelize, DataTypes) => {
    const Projects = sequelize.define('Projects', {
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

    Projects.associate = (models) => {
    Projects.belongsTo(models.Users, { foreignKey: 'user_id' });
    };

    return Projects;
};