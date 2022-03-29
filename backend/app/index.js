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
var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./models/user.model.js")(sequelize, Sequelize);
db.eventType = require("./models/eventType.model.js")(sequelize, Sequelize);
db.event = require("./models/event.model.js")(db);
db.password = require("./models/password.model.js")(sequelize, Sequelize);
db.computer = require("./models/computer.model.js")(sequelize, Sequelize);
db.session = require("./models/session.model.js")(db);
// db.user.hasMany(db.session, {foreignKey: "userId"})
// db.computer.hasMany(db.session, {foreignKey: "computerId"})


module.exports = db;
