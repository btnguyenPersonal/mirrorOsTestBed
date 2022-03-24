import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { xterm } from "./xterm";

export default (props) => {
  const [connected, setConnected] = useState(false);
  const [wsconnect, setWsconnect] = useState({});

  const Terminal = () => {
    const [term, setTerm] = new Terminal();

  var shellPrompt = '$ ';
  term.open(document.getElementById('terminal'));

  term.writeln('Hello from\x1B[1;3;32m xterm.js\x1B[0m $ ')
  prompt();
  term.setOption('cursorBlink', true);

  var str = "";
  term.onKey(e => {
    str += e.key;
    console.log(e.key);
    term.write(e.key);
    if (e.key == '\r') {
      term.write('\n');
      ws.send(str);
      str = "";
    }
  });

  function prompt() {
    term.write('\r' + shellPrompt);
  };

  const ws = new WebSocket("ws://localhost:9000");
  const msg = "frontend WebSocket is now open"

  ws.addEventListener("open", () =>{
    console.log("connected to server");
    ws.send(msg);
  });

  ws.onmessage = function (event) {
    console.log(event.data);
    term.writeln(event.data);
    prompt();
  };
  }

    return (
      <div>
        <xterm/>
      </div>
    );
};



//export default (props) => {
//  const [connected, setConnected] = useState(false);
//  const [wsconnect, setWsconnect] = useState({});
//
//  //const xtermRef = React.useRef(null);
//  this.xtermRef = React.createRef()
//  let message = "this is message";
//
//  const connect = () => {
//    console.log("starting...");
//    let ws = new WebSocket("ws://localhost:9000" + "/ws/webssh2/");
//
//    ws.addEventListener("open", function () {
//      console.log("opening");
//      this.xtermRef.current.terminal.write("echo> ");
//
//    const message = {
//      type: "connect-ssh",
//      id: "props.host.id"
//      };
//      ws.send(JSON.stringify(message));
//      setConnected(true);
//    });
//
//    ws.addEventListener("close", function () {
//      console.log("closing");
//      setConnected(false);
//    });
//
//    ws.addEventListener("message", function (e) {
//      console.log("data");
//      let message = {};
//      message += e.key;
//
//      if (e.key == '\r') {
//        wsconnect.send(message);
//        message = "";
//      }
//    setWsconnect(ws);
//    console.log("setWS");
//  });
//};
//
//  function onTermData(e) {
//    let message = {};
//    message += JSON.stringify(e);
//    console.log({message});
//
//    if (e.key == '\r') {
//      wsconnect.send(message);
//      message = "";
//    }
//  };
//
////  function onTermData(data) {
////    console.log("data");
////    let message = {};
////    message["type"] = "ssh-data";
////    message["data"] = data;
////    var send_data = JSON.stringify(message);
////    wsconnect.send(send_data);
////  }
//
//  return (
//    <div>
//      <Button onClick={connect} variant="contained" color="primary" align="right">
//        {connected ? "connected" : "NOT connected"}
//      </Button>
//
//      <XTerm
//        ref={this.xtermRef}
//        hide={!connected}
//        onData={onTermData}
//      />
//    </div>
//  );
//};