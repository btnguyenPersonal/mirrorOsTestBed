const webSocket = require("ws");
const api = require("../controllers/api.controller.js");

// create websocket server
const wsServer = new webSocket.Server({ port: 9000 });
//A dictionary mapping each active computer to it's associated websocket to the user using the computer.
var computerIdToWebsocketDict = {};

var { SerialPort, ReadlineParser } = require("serialport");
var serialPort = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 115200,
});
var serialPort2 = new SerialPort({
  path: "/dev/ttyUSB1",
  baudRate: 115200,
});
var parser = new ReadlineParser();
var parser2 = new ReadlineParser();
serialPort.pipe(parser);
serialPort2.pipe(parser2);
parser.on("data", function (data) {
  console.log("data from serial1: " + data);
  let ws1 = computerIdToWebsocketDict[1];
  console.log("ws1: " + ws1);
  if (!ws1) {
    console.log("no websocket computer 1");
    return;
  }
  ws1.send(
    JSON.stringify({
      messageType: "terminal-message",
      text: data,
    })
  );
});
parser2.on("data", function (data) {
  console.log("data from serial2: " + data);
  let ws2 = computerIdToWebsocketDict[2];
  if (!ws2) {
    console.log("no websocket computer 2");
    return;
  }
  ws2.send(
    JSON.stringify({
      messageType: "terminal-message",
      text: data,
    })
  );
});

wsServer.on("connection", async (ws) => {
  ws.on("message", (message) => {
    message = JSON.parse(message.toString());
    if (message.messageType === "websocket-initialization-message") {
      var computerId = message.computerId;
      var userId = message.userId;
      if (computerIdToWebsocketDict[computerId]) return;
      computerIdToWebsocketDict[computerId] = ws;
      ws.computerId = computerId;
      ws.userId = userId;
    } else if (message.messageType === "terminal-message") {
      console.log("Message received from frontend terminal: " + JSON.stringify(message.body));
      var computerId = ws.computerId;
      if (computerId == 1) {
        serialPort.write(message.body + "\n");
      } else if (computerId == 2) {
        serialPort2.write(message.body + "\n");
      } else {
        1
        console.log("Computer IDs 1 and 2 are the ony supported serial ports");
      }
    }
  });

  ws.on("close", async () => {
    if (!ws.computerId || !ws.userId) return;
    await api.releaseComputer({ body: { computerId: ws.computerId, userId: ws.userId } }, null);
    delete computerIdToWebsocketDict[ws.computerId];
  });
});

function simulateComputersReceivingData() {
  for (var computerId in computerIdToWebsocketDict) {
    let ws = computerIdToWebsocketDict[computerId];
    ws.send(
      JSON.stringify({
        messageType: "terminal-message",
        text: "faking some serial data every 10 seconds. This data is only being sent to computerId=" + computerId,
      })
    );
  }
}

//The following is to simulate data coming from serial stuff.
setInterval(() => {
  //simulateComputersReceivingData();
}, 100000);

module.exports = [computerIdToWebsocketDict];
