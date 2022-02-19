const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
var corsOptions = {
  origin: "http://localhost:3000",
};

const db = require("./app/models");
const EventType = db.event_type;
const Password = db.password;

//The following is to wipe the database everytime.
db.sequelize.sync({ force: true }).then(async () => {
  console.log("Drop and re-sync db.");
  //Order in which event types are created matters. See utils file for correct order.
  EventType.create({ event_type: "login" });
  EventType.create({ event_type: "admin login" });
  EventType.create({ event_type: "changed password" });
  EventType.create({ event_type: "changed admin password" });
  hashed_password = await bcrypt.hash("password", 10);
  Password.create({ password: hashed_password, is_admin_password: 0 });
  hashed_password = await bcrypt.hash("adminpassword", 10);
  Password.create({ password: hashed_password, is_admin_password: 1 });
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
require("./app/routes/event_type.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/api.routes")(app);
require("./app/routes/password.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
