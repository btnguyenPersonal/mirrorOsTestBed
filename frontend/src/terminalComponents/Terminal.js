import React, { useEffect } from "react";
import { XTerm } from "xterm-for-react";

function Terminal({ XTermOpt, XTermRef, ws }) {
  let messageString = "";

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
      if(code!==127){
        messageString += event.key;
        XTermRef.current.terminal.write(event.key);
      }
    }
  };

  let content = (
    <div>
      <XTerm ref={XTermRef} options={XTermOpt} onKey={onKey} />
    </div>
  );

  return content;
}
export default Terminal;
