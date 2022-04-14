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

  var [qws] = useState(new WebSocket(`ws://${process.env.REACT_APP_IP}:9001`));
  var [queue, setQueue] = useState(null);


  React.useEffect(() => {
    initWebSocket();
  });

  function initWebSocket() {
    qws.onopen = () => {
      //Let the backend know what user wants what computer.
      qws.send(JSON.stringify({ messageType: "websocket-queue-initialization-message", userId: userId}));
    };
  
    qws.onmessage = async (messageFromBackend) => {
      //Refresh the page, why not.
      loadData();
      //Convert the message to an object we can easily work with.
      var message = JSON.parse(messageFromBackend.data.toString());
      if (message.messageType === "granted-computer") {
        obtainComputer(message.computerId);
      } else if (message.messageType === "message-to-display") {
        document.getElementById("message_box").innerHTML = "<p><small>" + message.body + "</small></p>";
      } else if (message.messageType === "queue-data") {
        setQueue(message.queue);
      }
    };
  
    qws.onclose = () => {
      console.log("Queue websocket closed.");
    };
  }

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
    qws.send(JSON.stringify({ messageType: "join-queue", computerId: computerId}));
  }

  async function exitQueue(computerId) {
    qws.send(JSON.stringify({ messageType: "exit-queue", computerId: computerId}));
  }

  function isInQueue(computerId) {
    return queue[computerId].includes(userId);
  }

  function getPositionStr(computerId) {
    if(isInQueue(computerId)) {
      var thePosition = queue[computerId].indexOf(userId);
      return " | Position in queue: " + thePosition + " " + (thePosition === 0 ? "(You are next!)" : "");
    } else {
      return "Not in queue for computerId=" + computerId;
    }
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
              Computer ID: {item.computerId} | Computer Type: {item.model}
              {queue ? ` | Users in Queue: ${JSON.stringify(queue[item.computerId].length)}` : ""}
              {queue && isInQueue(item.computerId) ? getPositionStr(item.computerId) : ""}
              {!item.inUse ? (
                <p style={{ color: `#33CC33` }}>
                  <b>AVAILABLE</b>
                </p>
              ) : (
                <p style={{ color: `#FF0000` }}>
                  <b>IN USE</b>
                </p>
              )}
              {queue ? !isInQueue(item.computerId) ? (
                <button style={{ backgroundColor: `#8EE690` }} onClick={() => joinQueue(item.computerId)}>JOIN QUEUE</button>
              ) : (
                <button style={{ backgroundColor: `#E68E8E` }} onClick={() => exitQueue(item.computerId)}>EXIT QUEUE</button>
              ) : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={() => joinQueue("all")}>JOIN ALL QUEUES </button>
      <button onClick={() => exitQueue("all")}>EXIT ALL QUEUES </button>
      <div id="queue-state"> QUEUE STATE: {JSON.stringify(queue)}</div>
    </nav>
  );

  return content;
}

export default Dashboard;
