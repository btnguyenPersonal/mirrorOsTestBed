import './App.css';
import { ReactTerminal } from "react-terminal";

function App() {
  const commands = {
    user: "BrandonB",
    command1: "this is command 1",
    command2: "this is command 2",
    cd: (directory) => `changed path to ${directory}`
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>OS Testbed webpage</p>
        <p>COM S 402</p>
        <p>Group 11</p>
      </header>
      <ReactTerminal
        commands={commands}
      />
    </div>

  );
}

export default App;
