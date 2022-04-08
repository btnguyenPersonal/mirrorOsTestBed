import React, {
  useEffect
} from 'react'
import {
  XTerm
} from 'xterm-for-react'

function Terminal({computerId, userId}) {

  console.log(computerId + " " + userId)
  const XTermRef = React.useRef();
  const XTermOpt = {
    cursorBlink: true
  }

  var ws;

  connectWebSocket();

  let messageString = "";

  const prompt = (firstLine) => {
    if (firstLine) {
      XTermRef.current.terminal.write('$ ');
    } else {
      XTermRef.current.terminal.write('\r\n$ ');
    }
  };

  const onKey = (event) => {
    if (event.key === '\r') {
      //send through websocket
      ws.send(messageString);
      messageString = "";
      prompt(false);
    } else {
      messageString += event.key;
      XTermRef.current.terminal.write(event.key);
    }
  };

  async function connectWebSocket() {
    //If ws already exists, then don't reconnect.
    if (ws) return;
    //Check if the page has computer and user id.
    if (!isComputerIdAndUserIdPresent()) {
      return;
    }
    //This data variable should grab the data stored in react state.
    let data = {
      userId: userId,
      computerId: computerId
    };
    let res = await fetch(`http://localhost:8080/api/useComputer`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      let json = await response.json();
      response.json = json;
      return response;
    });
    printToTerminal(res.json.message);
    //If an error occured, it was already printed, so just exit.
    if (res.status !== 200) return;
    //Create websocket. Change localhost to be smarter using .env file.
    ws = new WebSocket("ws://localhost:9000");

    ws.onopen = () => {
      ws.send("websocket-initialization-message:" + computerId);
      printToTerminal("Connected to backend server.");
      prompt(false);
    };

    ws.onmessage = (messageFromBackend) => {
      printToTerminal(messageFromBackend.data);
      prompt(false);
    };

    ws.onclose = (e) => {
      printToTerminal("Websocket closed.");
      prompt(false);
    }
  }

  function printToTerminal(str) {
    console.log("attempting to print to terminal: " + str);
    XTermRef.current.terminal.write(str);
    prompt(false);
  }

  function isComputerIdAndUserIdPresent() {
    if (!computerId) {
      printToTerminal("Invalid computer ID")
      return false;
    }
    if (!userId) {
      printToTerminal("Invalid user ID")
      return false;
    }
    return true;
  }

  let content = (
    <div>
      <XTerm
        ref = { XTermRef }
        options = { XTermOpt }
        onKey = { onKey }
      />
    </div>
  );

  return content;
}
export default Terminal;