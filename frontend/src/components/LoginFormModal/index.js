import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(data)
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(data.errors)
        }
      });
  };

  return (
    <div id="login-form">
      <h2>Log In</h2>
      {errors.credential && (
          <p>{errors.credential}</p>
        )}
      <form onSubmit={handleSubmit} className="main-form">
        <label className="form-comp">
          Username or Email
          <input
          className="form-comp"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className="form-comp">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-comp"
          />
        </label>
        <button type="submit" id="login-button">Log In</button>
      </form>
        <a id="demo-user">Demo User</a>
    </div>
  );
}

export default LoginFormModal;
