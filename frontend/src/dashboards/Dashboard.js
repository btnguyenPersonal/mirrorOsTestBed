import React from "react";
import "./Dashboard.css";
import DashComponent from "./DashComponent";

function Dashboard({ setPage, setComputerId, userId }) {
  let content = (
    <DashComponent setPage={setPage} setComputerId={setComputerId} userId={userId} admin={false}/>
  );

  return content;
}

export default Dashboard;
