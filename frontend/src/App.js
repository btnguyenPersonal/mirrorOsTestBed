import './App.css';
import Login from './Login';
import React, { useState } from 'react';
import Dashboard from './dashboards/Dashboard';
import Terminal from './Terminal';
import TerminalChat from './TerminalChat';
import AdminDashboard from './dashboards/AdminDashboard';

function App() {
  //const [page, setPage] = useState("Login");
  //const [page, setPage] = useState("TerminalChat");
  const [page, setPage] = useState("Terminal");
  const [id, setID] = useState(-1);


  return (
    <div className="App">
    {page === "Login" && <Login setPage={setPage} />}
    {page === "Dashboard" && <Dashboard setPage={setPage} setID={setID} />}
    {page === "AdminDashboard" && <AdminDashboard setPage={setPage} setID={setID} />}
    {page === "Terminal" && <Terminal setPage={setPage} />}
    {page === "TerminalChat" && <TerminalChat setPage={setPage} />}
    </div>

  );
}

export default App;
