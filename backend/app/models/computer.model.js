module.exports = (db) => {
  var sequelize = db.sequelize;
  var Sequelize = db.Sequelize;
  const Computer = sequelize.define("computers", {
    computerId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    portId: {
      type: Sequelize.INTEGER,
    },
    serialNumber: {
      type: Sequelize.STRING,
    },
    model: {
      type: Sequelize.STRING,
    },
    inUse: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    numUsersWaiting: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  return Computer;
};
