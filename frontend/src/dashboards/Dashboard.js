import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard({ setPage, setComputerId, userId }) {
  const [list, setList] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadData = async () => {
    setLoaded(false);
    const res = await fetch(`http://${process.env.REACT_APP_IP}:8080/api/computer`);
    setList(await res.json());
  };

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

  async function joinQueue(computerId) {
    //qws is short for queue websocket.
    var qws = new WebSocket(`ws://${process.env.REACT_APP_IP}:9001`);

    qws.onopen = () => {
      //Let the backend know what user wants what computer.
      qws.send(JSON.stringify({ messageType: "websocket-queue-initialization-message", userId: userId, computerId: computerId }));
    };

    qws.onmessage = async (messageFromBackend) => {
      //Refresh the page, why not.
      loadData();
      //Convert the message to an object we can easily work with.
      console.log(messageFromBackend.data.toString());
      var message = JSON.parse(messageFromBackend.data.toString());
      console.log(message);
      if (message.messageType === "granted-computer") {
        obtainComputer(message.computerId);
      } else if (message.messageType === "message-to-display") {
        document.getElementById("message_box").innerHTML = "<p><small>" + message.body + "</small></p>";
      } else if (message.messageType === "queue-data") {
        updatePositionInQueueMessage(message.queue);
      }
    };

    qws.onclose = () => {
      console.log("Queue websocket closed.");
    };
  }

  function updatePositionInQueueMessage(queue) {
    var positions = "";
    for (const [computerId] of Object.entries(queue)) {
      var thePosition = queue[computerId].indexOf(userId);
      if (thePosition !== -1) {
        positions +=
          "computerId=" + computerId + ": You have " + thePosition + " student(s) in front of you. " + (thePosition === 0 ? "(You are next!)" : "") + "<br>";
      }
    }
    document.getElementById("message_box").innerHTML = "<p><small>" + positions + "</small></p>";
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
        setPage("TerminalPage");
      } else {
        document.getElementById("message_box").innerHTML = "<p><small>" + json.message + "</small></p>";
      }
    });
  }

  let content = (
    <nav>
      <div className="Header" style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => {
            loadData();
            document.getElementById("message_box").innerHTML = "";
          }}
        >
          Refresh Page
        </button>
        <div>Welcome</div>
        <div>OS Pi Testbed</div>
      </div>
      <div id="message_box"></div>
      {loaded ? (
        <ul>
          {list.map((item) => (
            <li key={item.computerId}>
              Computer ID: {item.computerId} | Computer Type: {item.model} | Users in Queue: {item.numUsersWaiting}
              {!item.inUse && item.numUsersWaiting === 0 ? (
                <p style={{ color: `#33CC33` }}>
                  <b>AVAILABLE</b>
                </p>
              ) : (
                <p style={{ color: `#FF0000` }}>
                  <b>IN USE</b>
                </p>
              )}
              <button onClick={() => joinQueue(item.computerId)}>JOIN QUEUE</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={() => joinQueue("any")}>JOIN QUEUE Pi Number: ALL Pi Type: ALL</button>
    </nav>
  );

  return content;
}

export default Dashboard;
