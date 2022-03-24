import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard({ setPage, setID }) {
  const [list, setList] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadData = async () => {
    const res = await fetch(
      `http://${process.env.REACT_APP_IP}:8080/api/computer`
    );
    setList(await res.json());
  };

  useEffect(() => {
    loadData();
    return () => {};
  }, []);

  useEffect(() => {
    if(list!=null)
      setLoaded(true);
  }, [list]);

  function onBtnClick(id, available) {
    if (available) {
      setPage("Terminal");
      setID(id);
    }
  }

  let content = (
    <nav>
      <div className="Header">Welcome</div>
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
