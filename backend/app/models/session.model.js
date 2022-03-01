module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define(
    "sessions",
    {
      sessionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      computerId: {
        type: Sequelize.INTEGER,
      },
      startTime: {
        type: Sequelize.DATE,
      },
      endTime: {
        type: Sequelize.DATE,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Session;
};
