import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

export default function Login() {
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
    // var data = {
    //     email: email,
    //     password: password
    // };
    // console.log(JSON.stringify(data));
    const login = { email, password};
    fetch("http://localhost:8080/api/login", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(login)
    }).then(() => {
      console.log("New user added")
    })
    // var xhr = new XMLHttpRequest();
    // var url = "http://localhost:8080/api/login";
    // xhr.open("POST",url,true);
    // xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // xhr.send(JSON.stringify(data));
    // xhr.onloadend = function () {
    //     // done
    // };
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email: </Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}