import React, { useEffect } from 'react'
import { XTerm } from 'xterm-for-react'
 
function Terminal() {
  const XTermRef = React.useRef();
  const XTermOpt = {
    cursorBlink:true
  }

  let messageString = "";

  const prompt = (firstLine) => {
    if(firstLine) {
      XTermRef.current.terminal.write('$ ');
    }else{
      XTermRef.current.terminal.write('\r\n$ ');
    }
  };

  const onKey = (event) => {
    if(event.key === '\r') {
      //send through websocket
      ws.send(messageString);
      messageString = "";
      prompt(false);
    }

    else {
      messageString += event.key;
      XTermRef.current.terminal.write(event.key);
    }
  };

  const ws = new WebSocket("ws://localhost:9000");
  const msg = "frontend WebSocket is now open"

  React.useEffect(() => {
      //initialize websocket
    ws.addEventListener("open", () =>{
      ws.send(msg);
    });
    prompt(true);
  });

    //websocket on message
    ws.onmessage = function (event) {
      XTermRef.current.terminal.write(event.data);
      prompt(false);
    };

    //websocket for closing
//        ws.addEventListener("close", function () {
//          console.log("closing");
//          prompt(false);
//        });

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