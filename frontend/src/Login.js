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
    sendCredentials(email,password);
    event.preventDefault();
  }

  function sendCredentials(email,password)
  {
    const login = { email, password};
    fetch(`http://${process.env.REACT_APP_IP}:8080/api/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(login)
    }).then((data) => {
      if(data.status===200){ 
        console.log("Success");
        setPage("Terminal");
      }else{
        console.log("Failure");
      }
    })
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
      <Button onClick={() => setPage("Terminal")}>Next Page Only here until login request works</Button>
    </div>
  );

  return content;
}

export default Login;
