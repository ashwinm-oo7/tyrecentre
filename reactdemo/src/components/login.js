import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FaUserLock,
  FaUserPlus,
  FaHome,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import tyreLogo from "../icons/tyrelogo.jpg";
import { toast } from "react-toastify";
import "../css/login.css";

export default class Login extends Component {
  state = {
    email: "",
    showForgotPasswordForm: false,
    otp: "",
    newPassword: "",
    resetPasswordSuccess: false,
    redirectToHome: false,
    step: 1, // Step 1 for entering email, Step 2 for entering OTP and new password
    isLoading: false,
    otpValidity: 0, // Time remaining for OTP validity in seconds
    timerInterval: null, // Interval reference for updating the timer
  };
  componentDidMount() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("userId");
    if (isLoggedIn) {
      // If user is already logged in, redirect to the homepage
      this.setState({ redirectToHome: true });
    }
  }

  // Function to start the OTP validity countdown timer
  startOTPTimer = () => {
    const timerInterval = setInterval(() => {
      const { otpValidity } = this.state;
      if (otpValidity > 0) {
        this.setState({ otpValidity: otpValidity - 1 });
      } else {
        clearInterval(this.state.timerInterval); // Clear timer interval when OTP expires
      }
    }, 1000); // Update timer every second
    this.setState({ timerInterval });
  };

  handleSendOTP = async () => {
    if (!this.state.email) {
      toast.warning("Please enter your email address");
      setTimeout(() => {
        toast.dismiss(); // Dismiss the toast after 0.2 seconds
      }, 2000);
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: this.state.email }),
        }
      );

      if (response.ok) {
        this.setState({ step: 2, otpValidity: 60 }); // Set OTP validity to 60 seconds
        this.startOTPTimer(); // Start OTP validity countdown timer
        toast.success("OTP sent successfully");
      } else {
        const errorMessage = await response.json();
        toast.error(errorMessage.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleResetPassword = async () => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@])[0-9a-zA-Z@]{8,}$/;
    if (!passwordRegex.test(this.state.newPassword)) {
      toast.warning(
        "Password must contain at least 8 characters, including one uppercase, one lowercase, one digit, and one special character '@'."
      );
      return;
    }
    this.setState({ isLoading: true });

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: this.state.email,
            otp: this.state.otp,
            newPassword: this.state.newPassword,
          }),
        }
      );
      console.log("RESponse", response);
      if (response.ok) {
        toast.success("Password reset successful", 2000);
        this.setState({
          step: 1,
          email: "",
          otp: "", // Clear OTP from state
          newPassword: "", // Clear new password from state
          timerInterval: null,
          otpValidity: 0,
          resetPasswordSuccess: true, // Set resetPasswordSuccess to true
        });
      } else {
        const errorMessage = await response.json();
        toast.error(errorMessage.message);
      }
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      this.setState({ isLoading: false });
    }
  };
  handleForgotPassword = () => {
    this.setState({
      showForgotPasswordForm: true,
      email: "",
      otp: "",
      newPassword: "",
      resetPasswordSuccess: false,
    });
  };

  login = async (e) => {
    e.preventDefault();
    console.log("HELLLO login : ", this.state);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/login",
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

      const loginData = await response.json();
      if (response.ok) {
        console.log(loginData);
        console.log("User LOGIN successfully");
        window.location = process.env.REACT_APP_API_URL_FOR_GUI;
        localStorage.setItem("userId", loginData._id);
        console.log("USERID", loginData._id, loginData.firstName);

        localStorage.setItem("firstName", loginData.firstName);
        localStorage.setItem("lastName", loginData.lastName);
        localStorage.setItem("userEmail", loginData.email);
        localStorage.setItem("isAdmin", loginData.isAdmin);
        localStorage.setItem("userName", loginData.userName);

        toast.success("Logged in successfully", 200);
      } else {
        toast.warning("Incorrect Credentials");
        console.error("Failed to LOGIN user");
      }
    } catch (error) {
      toast.warning("Something went wrong");
      console.error("Error during user LOGIN:", error);
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

    return (
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
          Login In
        </h3>
        <div className="mb-3">
          <label>
            <FaEnvelope style={{ marginRight: "5px" }} />
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email" // Added name attribute
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
            placeholder="Enter password"
            name="password" // Added name attribute
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.login.bind(this)}
            >
              Submit
            </button>
          </div>
        </div>
        {this.state.showForgotPasswordForm ? (
          this.renderForgotPasswordForm()
        ) : (
          <p className="forgot-password text-right">
            <a href="##" onClick={this.handleForgotPassword}>
              <FaLock /> Forgot password?
            </a>
          </p>
        )}

        {/* ////NEW///// */}
        {/* {this.state.step === 1 && (
          <div>
            <h3>Forgot Password</h3>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleSendOTP}
              disabled={this.state.isLoading || this.state.otpValidity > 0}
            >
              {this.state.isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
            {this.state.otpValidity > 0 && (
              <p>OTP expires in {this.state.otpValidity} seconds</p>
            )}
          </div>
        )}
        {this.state.step === 2 && (
          <div>
            <h3>Reset Password</h3>
            <div className="mb-3">
              <label>OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={this.state.otp}
                onChange={(e) => this.setState({ otp: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={this.state.newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleResetPassword}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.handleSendOTP}
              disabled={this.state.isLoading}
            >
              Resend OTP
            </button>
            {this.state.otpValidity > 0 && (
              <p>OTP expires in {this.state.otpValidity} seconds</p>
            )}
          </div>
        )} */}

        {/* ???????? */}
        <p className="new-user-signup">
          <FaUserPlus style={{ marginRight: "5px" }} />

          <Link to="/puncture-repair">Instant Puncture Service</Link>
        </p>

        <p className="new-user-signup">
          <FaUserPlus style={{ marginRight: "5px" }} />
          New User : <Link to="/sign-up">signup</Link>
        </p>
        <p className="forgot-password text-right">
          <FaHome style={{ marginRight: "5px" }} />
          <a href="/">Home</a>
        </p>
      </form>
    );
  }

  renderForgotPasswordForm() {
    if (this.state.resetPasswordSuccess) {
      setTimeout(() => {
        this.setState({ showForgotPasswordForm: false });
      }, 3000);

      return (
        <div>
          <p>Password reset successfully!</p>
        </div>
      );
    }

    return (
      <div>
        <p>
          Please enter your email address to receive a one-time password (OTP)
          for password reset.
        </p>
        {this.state.step === 1 && (
          <div>
            <h3>Forgot Password</h3>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleSendOTP}
              disabled={this.state.isLoading || this.state.otpValidity > 0}
            >
              {this.state.isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
            {/* Display timer for OTP validity */}
            {this.state.otpValidity > 0 && (
              <p>OTP expires in {this.state.otpValidity} seconds</p>
            )}
          </div>
        )}
        {this.state.step === 2 && (
          <div>
            <h3>Reset Password</h3>
            <div className="mb-3">
              <label>OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={this.state.otp}
                onChange={(e) => this.setState({ otp: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={this.state.newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleResetPassword}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
            {/* Button to resend OTP */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.handleSendOTP}
              disabled={this.state.isLoading}
            >
              Resend OTP
            </button>
            {/* Display timer for OTP validity */}
            {this.state.otpValidity > 0 && (
              <p>OTP expires in {this.state.otpValidity} seconds</p>
            )}
          </div>
        )}
      </div>
    );
  }
}
