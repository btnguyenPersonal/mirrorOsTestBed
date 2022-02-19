module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define(
    "events",
    {
      eventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventTypeId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
    },
    {
      updatedAt: false,
    }
  );
  return Event;
};
