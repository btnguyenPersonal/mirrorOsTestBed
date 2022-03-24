import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard({ setPage, setID }) {
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
    const interval = setInterval(() => {
      loadData();
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(list!=null)
      setLoaded(true);
  }, [list]);

  function onBtnClick(id, available) {
    if (available) {
      setID(id);
      let comp = {userId: 1,id};
      fetch(`http://${process.env.REACT_APP_IP}:8080/api/useComputer`,{method: "POST",body: comp})
      setPage("Terminal");
    }
  }

  let content = (
    <nav>
      <div className="Header" style={{display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={() => loadData()}>Refresh Page</button>
        <div >Welcome</div>
        <div>OS Pi Testbed</div>
      </div>
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
