import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    sendCredentials(email, password);
    event.preventDefault();
  }

  function sendCredentials(email, password) {
    const login = { email, password };
    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    }).then(async (response) => {
      if (response.status === 200) {
        let json = await response.json();
        if (json.usedAdminPassword) {
          setPage("AdminDashboard");
        } else {
          setPage("Dashboard");
        }
      } else {
        console.log("Failure");
      }
    });
  }

  let content = (
    <div className="Login">
      <h1>OS Test Bed</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Label className="input_field_label">Email: </Form.Label>
        <Form.Group size="lg" controlId="email">
          <Form.Control
            autoFocus
            className="input_field"
            pattern=".+@iastate\.edu"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Label className="input_field_label">Password: </Form.Label>
        <Form.Group size="lg" controlId="password">
          <Form.Control
            className="input_field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );

  return content;
}

export default Login;
