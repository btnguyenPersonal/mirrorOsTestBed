module.exports = (sequelize, Sequelize) => {
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
  });
  return Computer;
};
