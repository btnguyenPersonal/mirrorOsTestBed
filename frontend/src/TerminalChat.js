import React, { useState } from "react";
import Form from "react-bootstrap/Form";
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import "./TerminalChat.css";

function TerminalChat({ setPage }) {
  const [entry, setEntry] = useState('');
    const [connected, setConnected] = useState(false);
    const [ws, setWsconnect] = useState({});

  const handleInput = () => {
    console.log(entry);
  };

  const connect = () => {
    console.log("starting...");
    let ws = new WebSocket("ws://localhost:9000");

    ws.addEventListener("open", function () {
      console.log("opening");
      setConnected(true);
      ws.send("Frontend WebSocket is now open");
    });

    ws.addEventListener("close", function () {
      console.log("closing");
      setConnected(false);
    });

    ws.addEventListener("message", function (e) {
      console.log(e.data);
//      let message = {};
//      message += e.key;
//
//      if (e.key == '\r') {
//        wsconnect.send(message);
//        message = "";
//      }
      setWsconnect(ws);
      console.log("setWS");
    });
  };

  let content = (
    <div className="Chatbox">
    <h1>TerminalChat</h1>
      <input placeholder="input" onChange={e => setEntry(e.target.value)} />

      <button onClick={ () => handleInput()}>Send</button>

      <Button onClick={connect} variant="contained" color="primary">
        {connected ? "connected" : "NOT connected"}
      </Button>

      <div className="Echo">
          {entry ? <p>Output: {entry}</p> : ''}
      </div>
    </div>
  );
  return content;
}

export default TerminalChat;
