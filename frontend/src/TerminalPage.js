import Terminal from "./terminalComponents/Terminal";
import React, { useState } from "react";

function TerminalPage({ setPage, id, userId }) {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("imgFile", selectedFile);

    fetch(`http://${process.env.REACT_APP_IP}:8080/api/upload/${id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message !== "Successful file upload") {
          document.getElementById("errorStatus").innerHTML =
            "<p>" + result.message + "</p>";
        } else {
          setFileUploaded(true);
          document.getElementById("fileStatus").innerHTML =
            "<p>" + result.message + "</p>";
        }
      })
      .catch((error) => {
        setFileUploaded(true);
        document.getElementById("fileStatus").innerHTML =
          "<p>" + error + "</p>";
      });
  };

  const Upload = () => {
    return (
      <div>
        <input type="file" name="file" onChange={changeHandler} />
        {isFilePicked ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>
              Size in bytes:{" "}
              {(selectedFile.size / Math.pow(1000, 2)).toFixed(2)} mb
            </p>
            <p>
              lastModifiedDate:{" "}
              {selectedFile.lastModifiedDate.toLocaleDateString()}
            </p>
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

  function releaseSession() {
    let comp = { userId: userId, computerId: id };
    fetch(`http://${process.env.REACT_APP_IP}:8080/api/releaseComputer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comp),
    }).then(async (response) => {
      let json = await response.json();
      if (response.status === 200) {
        setPage("Dashboard");
      } else {
        document.getElementById("fail_message").innerHTML =
          "<p><small>" + json.message + "</small></p>";
      }
    });
  }

  React.useEffect(() => {
    const cleanup = () => {
      let comp = { userId: userId, computerId: id };
      fetch(`http://${process.env.REACT_APP_IP}:8080/api/releaseComputer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comp),
      });
    };
    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  let content = (
    <div>
      {fileUploaded ? (
        <div>
          <div id="fileStatus"></div> <br />{" "}
          <button onClick={() => setFileUploaded(false)}>
            Submit new File
          </button>{" "}
          <button
            onClick={() =>
              fetch(
                `http://${process.env.REACT_APP_IP}:8080/api/reboot/${id}`,
                {
                  method: "POST",
                }
              )
            }
          >
            Reset Pi
          </button>
          <button onClick={() => releaseSession()}>Release session</button>
          <div id="fail_message"></div>
        </div>
      ) : (
        <Upload />
      )}

      <Terminal />
    </div>
  );
  return content;
}

export default TerminalPage;
