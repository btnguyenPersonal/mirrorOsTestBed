import React, { useState, useEffect } from "react";
import './Dashboard.css'

var qws;
var wsIdDebug = "empty";

function DashComponent({ setPage, setComputerId, userId, isAdmin }) {
  const [list, setList] = useState(null);
  const [loaded, setLoaded] = useState(false);

  var [queue, setQueue] = useState(null);
  var [computersInUse, setComputersInUse] = useState(null);

  React.useEffect(() => {
    initWebSocket();
    window.onbeforeunload = () => qws.close();
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (list != null) setLoaded(true);
  }, [list]);

  async function loadData() {
    setLoaded(false);
    const res = await fetch(
      `http://${process.env.REACT_APP_IP}:8080/api/computer`
    );
    setList(await res.json());
    qws.send(
      JSON.stringify({
        messageType: "update-my-queue"
      })
    );
  };

  async function initWebSocket() {
    qws = new WebSocket(`ws://${process.env.REACT_APP_IP}:9001`);

    qws.onopen = async () => {
      qws.send(
        JSON.stringify({
          messageType: "websocket-queue-initialization-message",
          userId: userId,
        })
      );
    }

    qws.onmessage = async (messageFromBackend) => {
      //Convert the message to an object we can easily work with.
      var message = JSON.parse(messageFromBackend.data.toString());
      if (message.messageType === "initialize-websocket") {
        qws.id = message.wsId;
        wsIdDebug = message.wsId;       
        loadData();
      } else if (message.messageType === "granted-computer") {
        obtainComputer(message.computerId);
        loadData();
      } else if (message.messageType === "message-to-display") {
        document.getElementById("message_box").innerHTML =
          "<p><small>" + message.body + "</small></p>";
        loadData();
      } else if (message.messageType === "queue-data") {
        setQueue(message.queue);
        setComputersInUse(message.computersInUse);
      }
    };

    qws.onclose = () => {
      console.log("Queue websocket closed.");
    };
  }

  async function joinQueue(computerId) {
    qws.send(
      JSON.stringify({ messageType: "join-queue", computerId: computerId })
    );
  }

  async function exitQueue(computerId) {
    qws.send(
      JSON.stringify({ messageType: "exit-queue", computerId: computerId })
    );
  }

  function isInQueue(computerId) {
    return queue[computerId].queue.includes(userId);
  }

  function getPositionStr(computerId) {
    if (isInQueue(computerId)) {
      var thePosition = queue[computerId].queue.indexOf(userId);
      return (
        "Position: " +
        thePosition +
        " " +
        (thePosition === 0 ? "(You are next!)" : "")
      );
    } else {
      return "Not in queue for computerId=" + computerId;
    }
  }

  function kickUserOffComputer(computerId) {
    qws.send(JSON.stringify({
      messageType: "admin-kick-user-off-computer",
      adminUserId: userId,
      computerId: computerId
    }));
    setTimeout(function () {
      loadData();
    }, 300);
  }

  function joinFrontOfQueue(computerId) {
    qws.send(JSON.stringify({
      messageType: "admin-join-front-of-queue",
      adminUserId: userId,
      computerId: computerId
    }));
  }

  function clearQueue(computerId) {
    qws.send(JSON.stringify({
      messageType: "admin-clear-queue",
      adminUserId: userId,
      computerId: computerId
    }));
  }

  function obtainComputer(computerId) {
    let requestBody = { userId: userId, computerId: computerId };
    fetch(`http://${process.env.REACT_APP_IP}:8080/api/useComputer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then(async (response) => {
      let json = await response.json();
      if (response.status === 200) {
        setComputerId(computerId);
        await qws.close();
        setPage("TerminalPage");
      } else {
        document.getElementById("message_box").innerHTML =
          "<p><small>" + json.message + "</small></p>";
      }
    });
  }

  function deleteComputer(computerId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete the computer with id=" + computerId + "?"
    );
    if (confirmed) {
      let requestBody = { userId: userId, computerId: computerId };
      fetch(`http://${process.env.REACT_APP_IP}:8080/api/computer`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }).then(async (response) => {
        let json = await response.json();
        document.getElementById("message_box").innerHTML =
          "<p><small>" + json.message + "</small></p>";
        loadData();
      });
    }
  }

  function getSessionInfo(computerId) {
    if(!computersInUse) return "";
    if(!computersInUse[computerId]) return "";
    return "Session: " + computersInUse[computerId].user.email + ", " + getSessionDuration(computerId)
  }

  function getSessionDuration(computerId) {
    var now = new Date();
    var sessionStart = new Date(computersInUse[computerId].session.startTime);
    var durationMs = now - sessionStart;
    var hours = Math.floor(durationMs/(1000*60*60));
    var minutes = (durationMs/(1000*60)).toFixed(0);
    //actually needs to not use !=
    return (hours > 0 ? hours + "h " : "") +
      (minutes > 0 ? minutes + "m " : "<1m")
  }

  let content = (
    <nav>
        <button
            className="refreshButton"
          onClick={() => {
            loadData();
            document.getElementById("message_box").innerHTML = "";
          }}
        >
          ↺
        </button>
      <button className="dashButton" onClick={() => joinQueue("all")}>JOIN ALL QUEUES </button>
      <button className="dashButton" onClick={() => exitQueue("all")}>EXIT ALL QUEUES </button>
      {isAdmin ? (
        <div>       
          <div>
          </div>
          <b/>
          <button 
          className="dashButton"
          onClick={() => setPage("ChangePasswordForm")}>
            CHANGE PASSWORD
          </button>
          <button 
          className="dashButton"
          onClick={() => setPage("AddComputerForm")}>
            ADD COMPUTER
          </button>
        </div>
      ) : ""}
      <div id="message_box"></div>
      {loaded ? (
        <ul>
          {list.map((item) => (
            <li key={item.computerId}>
              <div className="row">
              <div className="column">
              <h2 className="defaultText">{item.model}</h2>
              {!item.inUse ? (
                <div style={{ color: `#33CC33` }}>
                  <h1>AVAILABLE</h1>
                </div>
              ) : (
                <div style={{ color: `#ff0000` }}>
                  <h1>IN USE</h1>
                </div>
              )}

              {item.inUse && (<h2 className="defaultText">{queue
                ? `Users waiting: ${JSON.stringify(
                    queue[item.computerId].queue.length
                  )}`
                : ""}
              </h2>)}
              {queue && isInQueue(item.computerId)
                && <h3>{getPositionStr(item.computerId)}</h3>}
              {isAdmin && (
                <div>
                  {getSessionInfo(item.computerId)}
                </div>
              )}
              </div>
              <div className="column">
              {queue && (
                !isInQueue(item.computerId) ? (
                  <button
                    className="dashButton"
                    onClick={() => joinQueue(item.computerId)}
                  >
                    JOIN
                  </button>
                ) : (
                  <button
                    className="redDashButton"
                    onClick={() => exitQueue(item.computerId)}
                  >
                    EXIT
                  </button>
                )
              )}
              {isAdmin && (
                <button
                    className="redDashButton"
                  onClick={() => {
                    if(!item.inUse) {
                      deleteComputer(item.computerId)
                    } else {
                      document.getElementById("message_box").innerHTML = "You cannot delete a computer that is in use.";
                    }}}
                >
                  DELETE
                </button>
              )}
              {isAdmin && (
                  <>
                <button
                    className="redDashButton"
                  onClick={() => kickUserOffComputer(item.computerId)}>
                  KICK
                </button> <div></div>
                <button
                    className="redDashButton"
                  onClick={() => joinFrontOfQueue(item.computerId)}>
                  JOIN FRONT
                </button>
                <button
                    className="redDashButton"
                  onClick={() => clearQueue(item.computerId)}>
                  CLEAR
                </button>
                  </>
                )
              } 
              </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <br/>
    </nav>
  );

  return content;
}

export default DashComponent;
