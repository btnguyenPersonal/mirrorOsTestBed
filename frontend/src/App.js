import './App.css';
import { ReactTerminal } from "react-terminal";

function App() {
  const commands = {
    user: "BrandonB",
    command1: "this is command 1",
    command2: "this is command 2",
    poe: "pi has been reset",
    cd: (directory) => `changed path to ${directory}`
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>OS Testbed webpage</p>
        <p>COM S 402</p>
        <p>Group 11</p>
        <p className="App-terminal">
        <ReactTerminal
            commands={commands}
          />
          </p>
      </header>
    </div>

  );
}

export default App;
