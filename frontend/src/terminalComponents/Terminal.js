import React, { useEffect } from "react";
import { XTerm } from "xterm-for-react";

function Terminal({ XTermOpt, XTermRef, ws }) {
  let messageString = "";

  const onKey = (event) => {
    if (event.key === "\r") {
      ws.send(JSON.stringify({ messageType: "terminal-message", body: messageString }));
      messageString = "";
      XTermRef.current.terminal.write("\r\n$ ");
    } else {
      messageString += event.key;
      XTermRef.current.terminal.write(event.key);
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
