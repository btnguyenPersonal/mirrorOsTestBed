import React from "react";
import { XTerm } from "xterm-for-react";

var ws;

function Terminal({ setPage, computerId, userId, isAdmin }) {
  let messageString = "";

  const XTermRef = React.useRef();
  const XTermOpt = { cursorBlink: true };

  React.useEffect(() => {
    initWebSocket();
    window.onbeforeunload = () => releaseSession(true);
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  async function releaseSession(isExitingPage) {
    let requestBody = { userId: userId, computerId: computerId };
    await fetch(`http://${process.env.REACT_APP_IP}:8080/api/releaseComputer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then(async (response) => {
      ws.close();
      if (isExitingPage) return;
      let json = await response.json();
      if (response.status === 200) {
        setTimeout(function () {
          if(isAdmin) {
            setPage("AdminDashboard")
          } else {
            setPage("Dashboard");
          }
        }, 1000);
      } else {
        document.getElementById("fail_message").innerHTML = "<p><small>" + json.message + "</small></p>";
      }
    });
  }

  async function initWebSocket() {
    ws = new WebSocket(`ws://${process.env.REACT_APP_IP}:9000`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ messageType: "websocket-initialization-message", computerId: computerId }));
      printToTerminal("You are now in control of computerId=" + computerId);
    };

    ws.onmessage = (messageFromBackend) => {
      var message = JSON.parse(messageFromBackend.data.toString());
      if(message.messageType === "admin-kicked-user") {
        releaseSession(false);
      } else {
        printToTerminal(message);
      }
    };

    ws.onclose = () => {
      printToTerminal("Session closed. You will be redirected shortly.");
    };
  }

  function clearTerminal() {
    XTermRef.current.terminal.clear();
  }

  function printToTerminal(str) {
    if (XTermRef.current) {
      XTermRef.current.terminal.write(str + "\r\n$ ");
    }
  }

  const onKey = (event) => {

    const code = event.key.charCodeAt(0);

    if(code === 127) {
      if(messageString.length>0){
        messageString = messageString.slice(0, -1);
        XTermRef.current.terminal.write("\b \b");
      }
    }

    if (event.key === "\r") {
      ws.send(JSON.stringify({ messageType: "terminal-message", body: messageString }));
      messageString = "";
      XTermRef.current.terminal.write("\r\n$ ");
    }
    else {
      if(code !== 127){
        messageString += event.key;
        XTermRef.current.terminal.write(event.key);
      }
    }
  };

  let content = (
    <div>
      <XTerm ref={XTermRef} options={XTermOpt} onKey={onKey} />
      <button onClick={() => releaseSession(false)}>Release session</button>
      <button onClick={() => clearTerminal()}>Clear terminal</button>
    </div>
  );

  return content;
}
export default Terminal;
