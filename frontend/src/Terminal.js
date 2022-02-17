import { ReactTerminal } from "react-terminal";

function Terminal({ setPage, commands }) {
  let content = (
    <ReactTerminal 
      commands={commands} 
    />
  );
  return content;
}

export default Terminal;
