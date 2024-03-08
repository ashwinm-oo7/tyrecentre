  import React, { Component } from 'react'
  import { Link } from 'react-router-dom';

import tyreLogo from '../icons/tyrelogo.png';


  export default class Login extends Component {
      state = {
          email: '',
          showForgotPasswordForm: false,
          otp: '',
          newPassword: '',
          resetPasswordSuccess: false,
          
        };
      
    render() {
      return (
        <form>
              <img height={100} width={100} src={tyreLogo} alt="Tyre Logo" className="tyre-logo" />

          <h3>Login In</h3>

          <div className="mb-3">
            <label>Email address</label>
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
            <label>Password</label>
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
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary"
                onClick={this.login.bind(this)}
              >
            
              Submit
            </button>
          </div>
          {this.state.showForgotPasswordForm ? (
            this.renderForgotPasswordForm()
          ) : (

          <p className="forgot-password text-right">
          {/* Forgot <a href="#" onClick={this.handleForgotPassword}>password?</a> */}
          </p> 
          )}
          <p className="new-user-signup">
            New User : <Link to="/sign-up">signup</Link>
          </p>
          <p className="forgot-password text-right"><a href="/home">Home</a></p>
        </form>
      )
    }
    renderForgotPasswordForm() {
      if (this.state.resetPasswordSuccess) {
        return (
          <div>
            <p>Password reset successfully!</p>
            {/* Add any additional UI or redirection logic as needed */}
          </div>
        );
      }

      

      return (
        <div>
          <p>
            Please enter your email address to receive a one-time password (OTP)
            for password reset.
          </p>
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
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleSendOTP}
            >
              Send OTP
            </button>
          </div>
          {this.state.otp && (
            <div className="mb-3">
              <label>Enter OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={this.state.otp}
                onChange={(e) => this.setState({ otp: e.target.value })}
              />
            </div>
          )}
          {this.state.otp && (
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
          )}
          {this.state.otp && (
            <div className="d-grid">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      );
    }

    handleForgotPassword = () => {
      this.setState({
        showForgotPasswordForm: true,
        email: '',
        otp: '',
        newPassword: '',
        resetPasswordSuccess: false,
      });
    };

    handleSendOTP = async () => {
      // Make an API call to your backend to initiate the forgot password flow
      // You should replace the placeholder URL and implement the actual logic
      const response = await fetch('YOUR_BACKEND_API_FORGOT_PASSWORD_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.state.email }),
      });

      if (response.ok) {
        // Set state to indicate that OTP has been sent
        this.setState({ otp: '' });
      } else {
        // Handle error scenario, show a message to the user, etc.
        console.error('Failed to send OTP');
      }
    };

    handleResetPassword = async () => {
      // Make an API call to your backend to verify OTP and reset password
      // You should replace the placeholder URL and implement the actual logic
      const response = await fetch('YOUR_BACKEND_API_RESET_PASSWORD_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          otp: this.state.otp,
          newPassword: this.state.newPassword,
        }),
      });

      if (response.ok) {
        // Set state to indicate that password reset was successful
        this.setState({ resetPasswordSuccess: true });
      } else {
        // Handle error scenario, show a message to the user, etc.
        console.error('Failed to reset password');
      }
    };

    login = async(e) => {
      
      e.preventDefault();
      console.log('HELLLO login : ' , this.state);

      //api call 
      //http://localhost:8080/tyrecentre/save

      try {
        const response = await fetch('http://localhost:8080/tyrecentre/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',

          },
          body: JSON.stringify(this.state),
        });

        if (response.ok) {
          console.log(response);
          console.log('User LOGIN successfully');
          window.location = 'http://localhost:3000/home';
          // this.props.history.push('/tyreProducts/tyreSample');
          // alert('User LOGIN successfully');
          

          // Redirect or perform any other actions after successful registration
        } else {
          console.error('Failed to LOGIN user');
        }
      } catch (error) {
        console.error('Error during user LOGIN:', error);
      }
    };
  }

