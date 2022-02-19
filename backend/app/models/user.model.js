module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        is_admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
    }, {
        updatedAt: false
    });
    return User;
};    