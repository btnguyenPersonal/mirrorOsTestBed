import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./AddComputerForm.css";
import AddSwitch from "./AddSwitch.js";

function AddComputerForm({ setPage, userId }) {
  const [list, setList] = useState([""]);
  const [model, setModel] = useState("");
  const [portId, setPortId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [switchId, setSwitchId] = useState(1);
  const options = ['Raspberry Pi 3b', 'Raspberry Pi 3b+', 'Raspberry Pi 4'];

  function validateForm() {
    return (
      model !== "" && portId !== "" && serialNumber !== "" && switchId !== ""
    );
  }

  function handleSubmit(event) {
    sendNewComputer();
    event.preventDefault();
  }

  async function loadData() {
    const res = await fetch(
      `http://${process.env.REACT_APP_IP}:8080/api/switch`
    );
    setList(await res.json());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  function sendNewComputer() {
    const computer = { model, portId, serialNumber, switchId, userId };
    fetch(`http://${process.env.REACT_APP_IP}:8080/api/computer/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(computer),
    }).then(async (response) => {
      let json = await response.json();
      document.getElementById("message_").innerHTML =
        "<p><small>" + json.message + "</small>";
    });
  }

  let content = (
    <div className="AddComputer">
      <button onClick={() => setPage("AdminDashboard")}>
        Go back to admin dashboard
      </button>
      <h1>Add Computer</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Label className="input_field_label">Model: </Form.Label>
        <Form.Group size="lg" controlId="model">
          <select id="template-select" value={model} onChange={(e) => setModel(e.target.value)}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Form.Group>
        <Form.Label className="input_field_label">Port ID: </Form.Label>
        <Form.Group size="lg" controlId="portId">
          <Form.Control
            className="input_field2"
            type="text"
            value={portId}
            onChange={(e) => setPortId(e.target.value)}
          />
        </Form.Group>
        <Form.Label className="input_field_label">Serial Number: </Form.Label>
        <Form.Group size="lg" controlId="serialNumber">
          <Form.Control
            className="input_field3"
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Label className="input_field_label">Switch ID: </Form.Label>
        <Form.Group size="lg" controlId="switchId">
        <select id="template-select" value={switchId} onChange={(e) => setSwitchId(e.target.value)}>
            {list.map((list) => (
              <option key={list.switchId} value={list.switchId}>
                {list.switchId} IP Address: {list.ipAddress}
              </option>
            ))}
          </select>
        </Form.Group>
        <Button size="lg" type="submit" disabled={!validateForm()}>
          Add Computer
        </Button>
      </Form>
      <AddSwitch />
      <div id="message_"></div>
    </div>
  );

  return content;
}

export default AddComputerForm;
