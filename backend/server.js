const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./app/config/swagger_output.json')

const app = express();
var corsOptions = {
  origin: "http://localhost:3000",
};

const db = require("./app/models");
const EventType = db.eventType;
const Password = db.password;

//The following is to wipe the database everytime.
db.sequelize.sync({ force: true }).then(async () => {
  console.log("Drop and re-sync db.");
  //Order in which event types are created matters. See utils file for correct order.
  EventType.create({ eventType: "login" });
  EventType.create({ eventType: "admin login" });
  EventType.create({ eventType: "changed password" });
  EventType.create({ eventType: "changed admin password" });
  hashedPassword = await bcrypt.hash("password", 10);
  Password.create({ password: hashedPassword, isAdminPassword: 0 });
  hashedPassword = await bcrypt.hash("adminpassword", 10);
  Password.create({ password: hashedPassword, isAdminPassword: 1 });
});

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Basic app." });
});
require("./app/routes/user.routes")(app);
require("./app/routes/eventType.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/api.routes")(app);
require("./app/routes/password.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));