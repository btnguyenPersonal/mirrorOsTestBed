const dbConfig = require("./config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./models/user.model.js")(sequelize, Sequelize);
db.eventType = require("./models/eventType.model.js")(sequelize, Sequelize);
db.event = require("./models/event.model.js")(sequelize, Sequelize);
db.password = require("./models/password.model.js")(sequelize, Sequelize);
db.computer = require("./models/computer.model.js")(sequelize, Sequelize);
db.session = require("./models/session.model.js")(sequelize, Sequelize);
module.exports = db;
