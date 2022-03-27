const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const webSocket = require("ws");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./app/config/swagger_output.json");

const app = express();
var corsOptions = {
  origin: `http://${process.env.IP}:3000`,
};

const db = require("./app");

initializeDb();

// create websocket server
const wsServer = new webSocket.Server({ port: 9000 });

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
require("./app/routes/computer.routes")(app);
require("./app/routes/session.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

async function initializeDb() {
  const EventType = db.eventType;
  const Password = db.password;
  const Computer = db.computer;
  //The following is to wipe the database everytime.
  db.sequelize.sync({ force: true }).then(async () => {
    console.log("Drop and re-sync db.");
    //Order in which event types are created matters. See utils file for correct order.
    await EventType.create({ eventType: "login" });
    await EventType.create({ eventType: "admin login" });
    await EventType.create({ eventType: "changed password" });
    await EventType.create({ eventType: "changed admin password" });
    await EventType.create({ eventType: "session start" });
    await EventType.create({ eventType: "session end" });
    //Password stuff.
    hashedPassword = await bcrypt.hash("password", 10);
    await Password.create({ password: hashedPassword, isAdminPassword: 0 });
    hashedPassword = await bcrypt.hash("adminpassword", 10);
    await Password.create({ password: hashedPassword, isAdminPassword: 1 });
    //Computer stuff. inUse is false by default.
    await Computer.create({ portId: 2, serialNumber: "e2f2ecf5", model: "Raspberry Pi 3 Model B+" });
    await Computer.create({ portId: 3, serialNumber: "e2f2ecf5", model: "Raspberry Pi 3 Model B+" });
    await Computer.create({ portId: 4, serialNumber: "e2f2ecf5", model: "Raspberry Pi 3 Model B+" });
    await Computer.create({ portId: 5, serialNumber: "e2f2ecf5", model: "Raspberry Pi 3 Model B+" });
    await Computer.create({ portId: 6, serialNumber: "e2f2ecf5", model: "Raspberry Pi 3 Model B+" });
    await Computer.create({ portId: 7, serialNumber: "e2f2ecf5", model: "Raspberry Pi 3 Model B+" });
  });
}

// create websocket connection
var computerIdToWebsocketDict = {};

var { SerialPort, ReadlineParser } = require("serialport");
var serialPort = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 115200,
});

wsServer.on("connection", (ws) => {
  var parser = new ReadlineParser();
  serialPort.pipe(parser);
  parser.on("data", function (data) {
    console.log("data from serial: " + data);
    ws.send(data);
  });

  ws.on("message", (message) => {
    message = message.toString();
    if (message.includes("websocket-initialization-message:")) {
      var computerId = message.split(":")[1];
      if (computerIdToWebsocketDict[computerId]) return;
      computerIdToWebsocketDict[computerId] = ws;
      ws.computerId = computerId;
    }
    console.log("Message received from frontend: " + message);
    ws.send("Message received on backend: " + message);
  });

  ws.on("close", () => {
    var computerId = ws.computerId;
    delete computerIdToWebsocketDict[computerId];
    console.log("websocket closed from frontend.");
  });
});

//The following is to simulate data coming from serial stuff.
setInterval(() => {
  simulateComputersReceivingData();
}, 10000);
function simulateComputersReceivingData() {
  for (var computerId in computerIdToWebsocketDict) {
    let ws = computerIdToWebsocketDict[computerId];
    ws.send("faking some serial data every 10 seconds. This data is only being sent to computerId=" + computerId);
  }
}
