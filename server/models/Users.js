// models/User.js

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
        isEmail: true,
        },
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    }, {
    timestamps: true,
    });

    Users.associate = (models) => {
        Users.hasMany(models.UserSkill, { foreignKey: 'user_id' });
        Users.hasMany(models.Projects, { foreignKey: 'user_id' });
        Users.hasMany(models.Experiences, { foreignKey: 'user_id' });

        // Відгуки, залишені ЦЬОМУ користувачу
        Users.hasMany(models.Testimonial, {
            foreignKey: 'user_id',
            as: 'TestimonialsReceived',
        });

        // Відгуки, залишені ЦИМ користувачем
        Users.hasMany(models.Testimonial, {
            foreignKey: 'author_id',
            as: 'AuthoredTestimonials',
        });
    };

    return Users;
};
