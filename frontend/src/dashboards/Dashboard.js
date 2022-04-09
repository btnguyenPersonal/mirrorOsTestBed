import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard({ setPage, setComputerId, userId }) {
  const [list, setList] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadData = async () => {
    setLoaded(false);
    const res = await fetch(
      `http://${process.env.REACT_APP_IP}:8080/api/computer`
    );
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
    if(list!=null)
      setLoaded(true);
  }, [list]);



  async function joinQueue(computerId) {

    var qws = new WebSocket(`ws://${process.env.REACT_APP_IP}:9001`);

    qws.onopen = () => {
      qws.send("websocket-queue-initialization-message:" + computerId + ":" + userId);
    };

    qws.onmessage = async (messageFromBackend) => {
      loadData(); //refresh page
      var message = messageFromBackend.data.toString();
      if(message.includes("Granted computerId=")) {
        computerId = message.split("=")[1];
        obtainComputer(computerId, true, false);
      } else if (message.includes("message-to-display:")) {
        var theMessage = message.split(":")[1];
        document.getElementById("message_box").innerHTML = "<p><small>"+theMessage+"</small></p>";
      } else if (message.includes("queue-data:/:")) {
        updatePositionInQueueMessage(JSON.parse(message.split(":/:")[1]));
      }
    };

    qws.onclose = () => {
      console.log("Websocket closed.");
    }
  }
  
  function updatePositionInQueueMessage(queue) {
    var positions = "";
    for (const [computerId] of Object.entries(queue)) {
      var thePosition = queue[computerId].indexOf(userId.toString());
      if(thePosition !== -1) {
        positions += "computerId=" + computerId + ": You have " + thePosition + " student(s) in front of you. " + (thePosition === 0 ? "(You are next!)" : "") + "\n"
      }
    }
    document.getElementById("message_box").innerHTML = "<p><small>"+positions+"</small></p>";
  }

  function obtainComputer(computerId, available) {
    if (available) {
      let comp = {userId: userId, computerId: computerId};
      fetch(`http://${process.env.REACT_APP_IP}:8080/api/useComputer`,
        { 
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(comp)
        }
      ).then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          setComputerId(computerId);
          setPage("TerminalPage");
        } else {
          document.getElementById("message_box").innerHTML = "<p><small>"+json.message+"</small></p>";
        }
      });
    }
  }

  let content = (
    <nav>
      <div className="Header" style={{display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={() => {loadData();
          document.getElementById("message_box").innerHTML = "";}}>Refresh Page</button>
        <div >Welcome</div>
        <div>OS Pi Testbed</div>
      </div>
      <div id="message_box"></div>
      {loaded ? (
        <ul>
          {list.map((item) => (
            <li key={item.computerId}>
              Computer ID: {item.computerId} | Computer Type: {item.model} | Users in Queue: {item.numUsersWaiting}
              <div/>
              <button onClick={() => joinQueue(item.computerId)}>
                JOIN QUEUE
              </button>
              <div>Pi availability: {String(!item.inUse && item.numUsersWaiting === 0)}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={() => joinQueue("any")}>
        JOIN QUEUE Pi Number: ALL Pi Type: ALL
      </button>
    </nav>
  );

  return content;
}

export default Dashboard;
