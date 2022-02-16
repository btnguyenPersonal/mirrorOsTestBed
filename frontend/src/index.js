import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import { TerminalContextProvider } from "react-terminal";

ReactDOM.render(
  <React.StrictMode>
    <TerminalContextProvider>
    <App />
    </TerminalContextProvider>
    <Login />
  </React.StrictMode>,
  document.getElementById('root')
);
