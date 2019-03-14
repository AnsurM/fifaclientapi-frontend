import React, { Component } from 'react';
import './App.css';
import Register from './Register';
import SignIn from './SignIn';
import 'tachyons';

const axios = require('axios');

var display = null;

class App extends Component {

  state = {
    ID: "",
    route: "Login",
    email: "",
    apikey: "",
    data: ""
  };

  onChange = (event) =>
  {
    this.setState({
      ID: event.target.value
    })
  }

  updateRoute = (value) =>
  {
    this.setState({
      route: value
    });
  }

  setEmailAndApiKey = (email,key) => {

    this.setState({
      email: email,
      apikey: key
    });
  };

  onSubmit = (query) =>
  {
    let that = this;
    // alert(`Submission request received for ID: ${this.state.ID}`);
      // console.log(`email: ${that.state.email} , apikey:  ${that.state.apikey}`);
    if(query == "userid")
    {
      // console.log(this.state.apikey);
      fetch('http://localhost:3001/getData',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
        email: that.state.email,
        apikey: that.state.apikey
        })
      })
      .then(response => response.json()) 
      .then(data => {
        console.log('data ', data);
      })
      .catch(function (error) {
          console.log(error);
        });
    }
  }

  render() {
    if(this.state.route == "Login")
    {
      display = 
      <div>
      <SignIn updateRoute={this.updateRoute} setEmailAndApiKey={this.setEmailAndApiKey}/>
      </div>
    }
    else if (this.state.route == "Register")
    {
      display = <Register updateRoute={this.updateRoute}/>
    }
    else if(this.state.route == "App")
    {
      display =  
      <div>
      <button type='submit' onClick={() => this.onSubmit("userid")}> <h3>Request Data</h3></button>
      </div>
    }
    return (
      <div className="App">
        <h1>Welcome to FUT Player Market</h1>
        {display}
      </div>
    );
  }
}

export default App;
