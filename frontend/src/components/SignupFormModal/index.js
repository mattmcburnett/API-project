import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const { closeModal } = useModal();

  useEffect(() => {
    if (!email || !username || !firstName || !lastName || !password || !confirmPassword) {
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    };

    if (username.length < 4 || password.length < 6) {
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    }

  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Passwords must match"
    });
  };

  return (
    <div id="signup-form-wrapper" >
      <h1 id="signup-form-header" >Sign Up</h1>
      <form id='signup-form' onSubmit={handleSubmit}>
        <label className="signup-form-comp">
          Email
          <input
            className="signup-form-comp"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="signup-errors">{errors.email}</p>}
        <label className="signup-form-comp">
          Username
          <input
            className="signup-form-comp"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="signup-errors">{errors.username}</p>}
        <label className="signup-form-comp">
          First Name
          <input
            className="signup-form-comp"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="signup-errors">{errors.firstName}</p>}
        <label className="signup-form-comp">
          Last Name
          <input
            className="signup-form-comp"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="signup-errors">{errors.lastName}</p>}
        <label className="signup-form-comp">
          Password
          <input
            className="signup-form-comp"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="signup-errors">{errors.password}</p>}
        <label className="signup-form-comp">
          Confirm Password
          <input
            className="signup-form-comp"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="signup-errors">{errors.confirmPassword}</p>
        )}
        <button disabled={buttonDisabled} id="signup-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
