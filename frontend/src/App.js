import './App.css';
import './Terminal.css';
import Terminal from './Terminal'
import Login from './Login';
import React, { useState } from 'react';
import Dashboard from './dashboards/Dashboard';
import AdminDashboard from './dashboards/AdminDashboard';

function App() {
  const [page, setPage] = useState("Login");
  const [id, setID] = useState(-1);

  const commands = {
    user: "BrandonB",
    command1: "this is command 1",
    command2: "this is command 2",
    poe: "pi has been reset",
    cd: (directory) => `changed path to ${directory}`
  };

  return (
    <div className="App">
    {page === "Login" && <Login setPage={setPage} />}
    {page === "Dashboard" && <Dashboard setPage={setPage} setID={setID} />}
    {page === "AdminDashboard" && <AdminDashboard setPage={setPage} setID={setID} />}
    {page === "Terminal" && <Terminal className="Terminal" setPage={setPage} commands={commands} id={id} />}
    </div>

  );
}

export default App;
