const webSocket = require("ws");

// create websocket server
const wsServer = new webSocket.Server({ port: 9000 });
//A dictionary mapping each active computer to it's associated websocket to the user using the computer.
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
    message = JSON.parse(message.toString());
    if (message.messageType === "websocket-initialization-message") {
      var computerId = message.computerId;
      if (computerIdToWebsocketDict[computerId]) return;
      computerIdToWebsocketDict[computerId] = ws;
      ws.computerId = computerId;
    } else if (message.messageType === "terminal-message") {
      console.log("Message received from frontend terminal: " + JSON.stringify(message.body));
    }
  });

  ws.on("close", () => {
    var computerId = ws.computerId;
    delete computerIdToWebsocketDict[computerId];
  });
});

function simulateComputersReceivingData() {
  for (var computerId in computerIdToWebsocketDict) {
    let ws = computerIdToWebsocketDict[computerId];
    ws.send("faking some serial data every 10 seconds. This data is only being sent to computerId=" + computerId);
  }
}

//The following is to simulate data coming from serial stuff.
setInterval(() => {
  simulateComputersReceivingData();
}, 60000);