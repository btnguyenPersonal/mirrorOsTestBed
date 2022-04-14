import Terminal from "./terminalComponents/Terminal";
import React, { useState } from "react";

function TerminalPage({ setPage, computerId, userId }) {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  var [ws] = useState(new WebSocket(`ws://${process.env.REACT_APP_IP}:9000`));

  React.useEffect(() => {
    initWebSocket();
    window.onbeforeunload = () => releaseSession(true);
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  });

  const XTermRef = React.useRef();
  const XTermOpt = { cursorBlink: true };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("imgFile", selectedFile);

    fetch(`http://${process.env.REACT_APP_IP}:8080/api/upload/${computerId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message !== "Successful file upload") {
          document.getElementById("errorStatus").innerHTML = "<p>" + result.message + "</p>";
        } else {
          setFileUploaded(true);
          document.getElementById("fileStatus").innerHTML = "<p>" + result.message + "</p>";
        }
      })
      .catch((error) => {
        setFileUploaded(true);
        document.getElementById("fileStatus").innerHTML = "<p>" + error + "</p>";
      });
  };

  const Upload = () => {
    return (
      <div>
        <input type="file" name="file" onChange={changeHandler} />
        {isFilePicked ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Size in bytes: {(selectedFile.size / Math.pow(1000, 2)).toFixed(2)} mb</p>
            <p>lastModifiedDate: {selectedFile.lastModifiedDate.toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        <div>
          <button onClick={handleSubmission}>Submit</button>
        </div>
        <div id="errorStatus"></div>
      </div>
    );
  };

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
          setPage("Dashboard");
        }, 1000);
      } else {
        document.getElementById("fail_message").innerHTML = "<p><small>" + json.message + "</small></p>";
      }
    });
  }

  async function initWebSocket() {
    ws.onopen = () => {
      ws.send(JSON.stringify({ messageType: "websocket-initialization-message", computerId: computerId }));
      printToTerminal("You are now in control of computerId=" + computerId);
    };

    ws.onmessage = (messageFromBackend) => {
      printToTerminal(messageFromBackend.data);
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

  let content = (
    <div>
      {fileUploaded ? (
        <div>
          <div id="fileStatus"></div> <br /> <button onClick={() => setFileUploaded(false)}>Submit new File</button>{" "}
          <button
            onClick={() =>
              fetch(`http://${process.env.REACT_APP_IP}:8080/api/reboot/${computerId}`, {
                method: "POST",
              })
            }
          >
            Reset Pi
          </button>
          <button onClick={() => releaseSession(false)}>Release session</button>
          <div id="fail_message"></div>
        </div>
      ) : (
        <Upload />
      )}

      <Terminal XTermOpt={XTermOpt} XTermRef={XTermRef} ws={ws} />
      <button onClick={() => releaseSession(false)}>Release session</button>
      <button onClick={() => clearTerminal()}>Clear terminal</button>
    </div>
  );
  return content;
}

export default TerminalPage;
