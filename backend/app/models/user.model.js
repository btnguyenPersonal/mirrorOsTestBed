module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
  });
  return User;
};
