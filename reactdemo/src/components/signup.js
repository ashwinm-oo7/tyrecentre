import React, { Component } from "react";
import tyreLogo from "../icons/tyrelogo.png";
import "../css/signup.css";
import {
  FaUserLock,
  FaTools,
  FaUser,
  FaLock,
  FaEnvelope,
  FaHome,
  FaSignInAlt,
} from "react-icons/fa";
export default class SignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    pinCode: 0,
    age: 0,
    password: "",
  };
  render() {
    return (
      <div className="login-container">
        <div className="form-wrapper">
          <form>
            <img
              height={100}
              width={100}
              src={tyreLogo}
              alt="Tyre Logo"
              className="tyre-logo"
            />

            <h3>
              <FaUserLock style={{ marginRight: "5px" }} />
              Sign Up
            </h3>

            <div className="mb-3">
              <label>
                <FaUser style={{ marginRight: "5px" }} />
                First name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                value={this.state.firstName}
                onChange={(e) => this.setState({ firstName: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label>
                <FaUser style={{ marginRight: "5px" }} />
                Last name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                value={this.state.lastName}
                onChange={(e) => this.setState({ lastName: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label>
                <FaEnvelope style={{ marginRight: "5px" }} />
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder=" Enter email"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label>
                <FaLock style={{ marginRight: "5px" }} />
                Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder=" Enter password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>

            <div className="d-grid">
              <button
                className="btn btn-primary"
                onClick={this.signUp.bind(this)}
              >
                Sign Up
              </button>
            </div>
            <p className="forgot-password text-right">
              Already registered{" "}
              <a href="/login">
                <FaSignInAlt style={{ marginRight: "5px" }} />
                sign in?
              </a>
            </p>
            <p className="forgot-password text-right">
              <a href="/home">
                <FaHome style={{ marginRight: "5px" }} />
                Home
              </a>
            </p>
          </form>
        </div>
        <div className="tyrecentre-info">
          <img
            alt=""
            src="assets/img/logo/tyrelogo.jpg"
            style={{ width: "500px", height: "auto" }}
          />
          <p class="service-description">
            <FaTools style={{ marginRight: "5px" }} />
            Services Available <br />
            For New Tyre and Puncture Repair
          </p>
          <img src={tyreLogo} alt="Tyre Logo" className="additional-logo" />
        </div>
      </div>
    );
  }
  signUp = async (e) => {
    e.preventDefault();
    console.log("HELLLO : ", this.state);

    //api call
    //http://localhost:8080/tyrecentre/save

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          },
          body: JSON.stringify(this.state),
        }
      );

      if (response.ok) {
        console.log("User registered successfully");
        // Redirect or perform any other actions after successful registration
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };
}
