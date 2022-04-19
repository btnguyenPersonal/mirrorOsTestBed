import { useState } from "react";

function AddComp({userId}) {
  const [add, setAdd] = useState(true);
  const [model, setModel] = useState("");
  const [portId, setPortId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [switchId, setSwitchId] = useState("");

  const handleSubmit = () => {
    const computer = { model, portId, serialNumber, switchId, userId };
    fetch(`http://${process.env.REACT_APP_IP}:8080/api/computer/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(computer),
    }).then(async (response) => {
      if (response.status === 200) {
        setAdd(true);
      } else {
        document.getElementById("fail_message").innerHTML = response.message;
      }
    });
  };

  let content = (
    <div>
      <br />
      {add ? (
        <button onClick={() => setAdd(false)}>Add new Computer</button>
      ) : (
        <div>
          <h3>Adding new computer</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label>
              Model:
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </label>
            <label>
              Port Number:
              <input
                type="text"
                value={portId}
                onChange={(e) => setPortId(e.target.value)}
              />
            </label>
            <label>
              Serial Number:
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </label>
            <label>
              Switch Id:
              <input
                type="text"
                value={switchId}
                onChange={(e) => setSwitchId(e.target.value)}
              />
            </label>
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
      <div id="fail_message"></div>
    </div>
  );
  return content;
}
export default AddComp;
