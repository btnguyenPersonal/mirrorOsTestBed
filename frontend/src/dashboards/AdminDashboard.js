import "./AdminDashboard.css";
import Chartist from "react-chartist";
import { useState, useEffect } from 'react';
import Button from "react-bootstrap/esm/Button";

function AdminDashboard({ setPage, setID }) {
    const [graph, setGraph] = useState(false);
  var occurrences = [];
  let chartA = {};

  const list = [
    {
      id: "1",
      piType: "3b+",
      available: true,
    },
    {
      id: "2",
      piType: "4",
      available: false,
    },
    {
      id: "3",
      piType: "3b+",
      available: false,
    },
  ];

  function getEvents() {
    fetch("http://localhost:8080/api/event", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.status === 200) {
        let json = await response.json();
        let seriesVals = [];
        for (var i = 1; i < json.length; i++) {
          seriesVals.push(new Date(json[i].createdAt).getHours());
        }
        occurrences = seriesVals.reduce(function (obj, item) {
          obj[item] = (obj[item] || 0) + 1;
          return obj;
        }, {});
        chartA = {
            labels: [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
              22, 23, 24,
            ],
            series: [occurrences]
          };
          return chartA;
      }
    });
  }

  let optionsA = {};

  function onBtnClick(id, available) {
    if (available) {
      setPage("Terminal");
      setID(id);
    }
  }

  useEffect(() => {
    getEvents();
  }, []);

  let content = (
    <nav>
      <div className="Header">Welcome</div>
      <div onLoad={getEvents()} className="AdminDashboard">
        {!graph && <Button onClick={()=>setGraph(true)}>Use Graph</Button>}
        {graph && <Chartist data={chartA} options={optionsA} type={"Bar"} />}
      </div>
      <ul>
        {list.map((item) => (
          <li key={item.id}>
            <button onClick={() => onBtnClick(item.id, item.available)}>
              Pi Number: {item.id} Pi Type: {item.piType}
            </button>
            <div>Pi availability: {String(item.available)}</div>
          </li>
        ))}
      </ul>
    </nav>
  );
  return content;
}

export default AdminDashboard;
