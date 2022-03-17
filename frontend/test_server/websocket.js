const webSocket = require("ws");

// create websocket server
const wsServer = new webSocket.Server({ port: 9000 });

// create websocket connection
wsServer.on('connection', ws => {
	ws.on('message', message => {
		ws.send('Message received on backend: ' + message);
	});
});
