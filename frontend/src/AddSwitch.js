import { useState } from "react";

function AddSwitch() {
  const [add, setAdd] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const handleSubmit = () => {
    const switchNew = { ipAddress, username, password};
    fetch(`http://${process.env.REACT_APP_IP}:8080/api/switch/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(switchNew),
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
        <button onClick={() => setAdd(false)}>Add new POE Switch</button>
      ) : (
        <div>
          <h3>Adding new POE Switch</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label>
              Ip Address:
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </label>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
export default AddSwitch;
