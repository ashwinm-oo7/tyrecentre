import React, { Component } from "react";
import tyreLogo from "../icons/tyrelogo.jpg";
import "../css/signup.css";
import { toast } from "react-toastify";

import {
  FaUserLock,
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
    redirectToHome: false,
    otp: "",
    redirectToLogin: false,
    otpSent: false, // Track if OTP is sent
    otpExpired: false, // Track if OTP is expired
    countdown: 60, // Initial countdown value in seconds
  };
  componentDidMount() {
    const isLoggedIn = localStorage.getItem("userId");
    if (isLoggedIn) {
      this.setState({ redirectToHome: true });
    }
  }
  startCountdown = () => {
    // Update the countdown timer every second
    this.interval = setInterval(() => {
      // Decrease countdown value by 1 second
      this.setState((prevState) => ({
        countdown: prevState.countdown - 1,
      }));

      // Check if countdown reaches 0
      if (this.state.countdown <= 0) {
        // Stop the countdown
        clearInterval(this.interval);
        // Set OTP as expired
        this.setState({ otpExpired: true });
      }
    }, 1000); // 1000 milliseconds = 1 second
  };

  componentWillUnmount() {
    // Clear the interval when the component is unmounted
    clearInterval(this.interval);
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  signUp = async (e) => {
    e.preventDefault();
    console.log("HELLLO : ", this.state);
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@])[0-9a-zA-Z@]{8,}$/;

    // Check if the password meets the validation criteria

    try {
      // Check if email already exists in the database
      const emailExistsResponse = await fetch(
        process.env.REACT_APP_API_URL + "user/emailExists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          },
          body: JSON.stringify({ email: this.state.email }),
        }
      );
      const emailExistsData = await emailExistsResponse.json();

      if (emailExistsData.exists) {
        toast.warning("Email already exists. Please use a different email.");
        return; // Exit the function if email already exists
      }

      if (!passwordRegex.test(this.state.password)) {
        toast.warning(
          "Password must contain at least 8 characters, including one uppercase, one lowercase, one digit, and one special character '@'."
        );
        return;
      }

      // Proceed with signup if email doesn't exist

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
          body: JSON.stringify({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
          }),
        }
      );
      this.setState({
        firstName: "",
        lastName: "",
        password: "",
      });
      console.log("response:::::::::::", response);
      if (response.status === 201) {
        this.setState({ otpSent: true });
        this.startCountdown();
        toast.success("SignUp in successfully", 200);

        console.log("User registered successfully");
        // Redirect or perform any other actions after successful registration
      } else {
        toast.warning("Incorrect Credentials");

        console.error("Failed to register user");
      }
    } catch (error) {
      toast.warning("Something went wrong");

      console.error("Error during user registration:", error);
    }
  };

  verifyOTP = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.state.email,
            otp: this.state.otp,
          }),
        }
      );
      console.log("VERIFUEMAIL", this.state.email);
      if (response.ok) {
        this.setState({ email: "", otp: "" });
        toast.success("OTP verified successfully");
        window.location.href = "http://localhost:3000/login";

        // return <Redirect to="/login" />;
      } else {
        // OTP verification failed
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP");
    }
  };

  render() {
    if (this.state.redirectToHome) {
      setTimeout(() => {
        window.location = process.env.REACT_APP_API_URL_FOR_GUI;
      }, 10); // 3000 milliseconds = 3 seconds

      return (
        <div>
          <img src={tyreLogo} alt="Redirecting..." />
        </div>
      );
    }
    if (this.state.otpSent && !this.state.otpExpired) {
      return (
        <div>
          <h2>Enter OTP</h2>
          <form onSubmit={this.verifyOTP}>
            <div className="form-group">
              <p>Time left to verify OTP: {this.state.countdown} seconds</p>
              <label htmlFor="otp">OTP:</label>
              <input
                type="text"
                className="form-control"
                id="otp"
                name="otp"
                value={this.state.otp}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Verify OTP
            </button>
          </form>
        </div>
      );
    }

    if (this.state.otpExpired) {
      this.setState({ otpSent: false });
      window.location.href = "http://localhost:3000/sign-up";
      return (
        <div>
          <h2>OTP Expired</h2>
          <p>
            The OTP has expired.also SignUP expired due to verification Please
            sign up again.
          </p>
          {/* You can use React Router for navigation */}
        </div>
      );
    }

    return (
      // <div className="login-container">
      // <div className="form-wrapper">
      <form className="forms">
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
          <button className="btn btn-primary" onClick={this.signUp.bind(this)}>
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
    );
  }
}
