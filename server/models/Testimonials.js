// models/Review.js

module.exports = (sequelize, DataTypes) => {
    const Testimonials = sequelize.define('Testimonials', {
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
    }, {
    timestamps: true,
    });

  // Зв'язки з User (кому відгук та хто залишив)
    Testimonials.associate = (models) => {
        Testimonials.belongsTo(models.Users, { foreignKey: 'user_id' });
        Testimonials.belongsTo(models.Users, { foreignKey: 'testimonials_id' });
    };

    return Testimonials;
};