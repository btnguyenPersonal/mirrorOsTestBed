import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./AddComputerForm.css";

function AddComputerForm({ setPage, userId }) {
    const [model, setModel] = useState("");
    const [portId, setPortId] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [switchId, setSwitchId] = useState("");
  

  function validateForm() {
    return (model !== "" && portId !== "" && serialNumber !== "" && switchId !== "");
  }

  function handleSubmit(event) {
    sendNewComputer();
    event.preventDefault();
  }

  function sendNewComputer() {
    const computer = { model, portId, serialNumber, switchId, userId };
    fetch(`http://${process.env.REACT_APP_IP}:8080/api/computer/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(computer),
    }).then(async (response) => {
      let json = await response.json();
      document.getElementById("message_").innerHTML = "<p><small>" + json.message + "</small>";
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
          <Form.Control
            className="input_field1"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
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
          <Form.Control
            className="input_field4"
            type="text"
            value={switchId}
            onChange={(e) => setSwitchId(e.target.value)}
          />
        </Form.Group>
        <Button size="lg" type="submit" disabled={!validateForm()}>
          Add Computer
        </Button>
      </Form>
      <div id="message_"></div>
    </div>
  );

  return content;
}

export default AddComputerForm;
