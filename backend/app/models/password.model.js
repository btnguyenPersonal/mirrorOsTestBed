module.exports = (sequelize, Sequelize) => {
    const Password = sequelize.define("password", {
        password_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: Sequelize.STRING
        },
    }, {
        updatedAt: false
    });
    return Password;
};