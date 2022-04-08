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

  function onBtnClick(computerId, available) {
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
          document.getElementById("fail_message").innerHTML = "<p><small>"+json.message+"</small></p>";
        }
      });
    }
  }

  let content = (
    <nav>
      <div className="Header" style={{display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={() => {loadData();
          document.getElementById("fail_message").innerHTML = "";}}>Refresh Page</button>
        <div >Welcome</div>
        <div>OS Pi Testbed</div>
      </div>
      <div id="fail_message"></div>
      {loaded ? (
        <ul>
          {list.map((item) => (
            <li key={item.computerId}>
              <button onClick={() => onBtnClick(item.computerId, !item.inUse)}>
                Pi Number: {item.computerId} Pi Type: {item.model}
              </button>
              <div>Pi availability: {String(!item.inUse)}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </nav>
  );

  return content;
}

export default Dashboard;
