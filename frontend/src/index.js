import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TerminalContextProvider } from "react-terminal";

ReactDOM.render(
  <React.StrictMode>
  <TerminalContextProvider>
    <App />
    </TerminalContextProvider>,
      rootElement
  </React.StrictMode>,
  document.getElementById('root')
);
