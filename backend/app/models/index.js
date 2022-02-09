const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./user.model.js")(sequelize, Sequelize);
db.event_types = require("./event_type.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize);
module.exports = db;