
import React, { Component } from 'react'
import tyreLogo from '../icons/tyrelogo.png';

export default class SignUp extends Component {

  state = {
     firstName:'',
	 lastName:'',
	 phoneNumber:'',
	 email:'',
	 pinCode:0,
	 age:0,
	 password:''
  };
  render() {
    return (
      <form>
      <img height={100} width={100} src={tyreLogo} alt="Tyre Logo" className="tyre-logo" />

        <h3>Sign Up</h3>

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            value={this.state.firstName}
            onChange={(e) => this.setState({ firstName: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input type="text" className="form-control" placeholder="Last name"
          value={this.state.lastName}
            onChange={(e) => this.setState({ lastName: e.target.value })}
             />
        </div>

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
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary"
          onClick={this.signUp.bind(this)}
          >
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/login">sign in?</a>
          
        </p>
        <p className="forgot-password text-right"><a href="/home">Home</a></p>

      </form>
    )
  }
  signUp = async(e) => {
    
    e.preventDefault();
    console.log('HELLLO : ' , this.state);

    //api call 
    //http://localhost:8080/tyrecentre/save

    try {
      const response = await fetch('http://localhost:8080/tyrecentre/signup', {
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
        console.log('User registered successfully');
        // Redirect or perform any other actions after successful registration
      } else {
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error during user registration:', error);
    }
  };


  };


