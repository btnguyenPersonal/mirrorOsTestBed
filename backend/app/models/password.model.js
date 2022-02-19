module.exports = (sequelize, Sequelize) => {
  const Password = sequelize.define(
    "password",
    {
      password_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      is_admin_password: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
    }
  );
  return Password;
};
