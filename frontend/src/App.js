import './App.css';
import './TerminalPage.css';
import TerminalPage from './TerminalPage'
import Login from './Login';
import React, { useState } from 'react';
import Dashboard from './dashboards/Dashboard';
import AdminDashboard from './dashboards/AdminDashboard';

function App() {
  const [page, setPage] = useState("Login");
  const [id, setID] = useState(-1);

  return (
    <div className="App">
    {page === "Login" && <Login setPage={setPage} />}
    {page === "Dashboard" && <Dashboard setPage={setPage} setID={setID} />}
    {page === "AdminDashboard" && <AdminDashboard setPage={setPage} setID={setID} />}
    {page === "TerminalPage" && <TerminalPage className="TerminalPage" setPage={setPage} id={id} />}
    </div>

  );
}

export default App;
