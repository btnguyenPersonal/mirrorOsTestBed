import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TerminalContextProvider } from "react-terminal";

ReactDOM.render(
  <TerminalContextProvider>
    <App />
  </TerminalContextProvider>,
  document.getElementById('root')
);
