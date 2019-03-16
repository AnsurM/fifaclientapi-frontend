import React, { Component } from 'react';
import './App.css';
import Register from './Register';
import PlayerData from './PlayerData';
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
        <PlayerData data={this.state}/>
      </div>
    }
    return (
      <div className="App">
        <h1 style={{display: 'flex', justifyContent: 'center'}}>Welcome to FUT Player Market</h1>
        {display}
      </div>
    );
  }
}

export default App;
