const webSocket = require('ws');

// create websocket server
const wsServer = new webSocket.Server({ port: 9000 });
// create websocket connection
var computerIdToWebsocketDict = {};

// var { SerialPort, ReadlineParser } = require("serialport");
// var serialPort = new SerialPort({
//   path: "/dev/ttyUSB0",
//   baudRate: 115200,
// });

wsServer.on("connection", (ws) => {
  // var parser = new ReadlineParser();
  // serialPort.pipe(parser);
  // parser.on("data", function (data) {
  //   console.log("data from serial: " + data);
  //   ws.send(data);
  // });

  ws.on("message", (message) => {
    message = message.toString();
    if (message.includes("websocket-initialization-message:")) {
      var computerId = message.split(":")[1];
      if (computerIdToWebsocketDict[computerId]) return;
      computerIdToWebsocketDict[computerId] = ws;
      ws.computerId = computerId;
    }
    console.log("Message received from frontend: " + message);
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
}, 60000);
function simulateComputersReceivingData() {
  for (var computerId in computerIdToWebsocketDict) {
    let ws = computerIdToWebsocketDict[computerId];
    console.log("faking some serial data every 10 seconds. This data is only being sent to computerId=" + computerId);
    ws.send("faking some serial data every 10 seconds. This data is only being sent to computerId=" + computerId);
  }
}


