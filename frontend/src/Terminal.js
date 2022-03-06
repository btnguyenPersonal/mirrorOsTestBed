import { ReactTerminal } from "react-terminal";

function Terminal({ setPage, commands, id }) {

  console.log(id);
  let content = (
    <ReactTerminal 
      commands={commands} 
    />
  );
  return content;
}

export default Terminal;
