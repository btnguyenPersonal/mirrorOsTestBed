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
  const [userId, setUserId] = useState(-1);

  return (
    <div className="App">
    {page === "Login" && <Login setPage={setPage} setUserId={setUserId} />}
    {page === "Dashboard" && <Dashboard setPage={setPage} setID={setID} userId={userId} />}
    {page === "AdminDashboard" && <AdminDashboard setPage={setPage} setID={setID} userId={userId} />}
    {page === "TerminalPage" && <TerminalPage className="TerminalPage" setPage={setPage} id={id} userId={userId} />}
    </div>

  );
}

export default App;
