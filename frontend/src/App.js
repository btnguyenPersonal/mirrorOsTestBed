import './App.css';
import './Terminal.css';
import Terminal from './Terminal'
import Login from './Login';
import React, { useState } from 'react';

function App() {
  const [page, setPage] = useState("Login");

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
    {page === "Terminal" && <Terminal className="Terminal" setPage={setPage} commands={commands} />}
    </div>

  );
}

export default App;
