import React, { Component } from 'react';
import './App.css';
import Register from './Register';
import PlayerData from './PlayerData';
import SignIn from './SignIn';
import TableClass from './TableClass';
import PlayerHandler from './PlayerHandler';
import 'tachyons';


const axios = require('axios');

var display = null;

class App extends Component {

  state = {
    route: "Login",
    email: "",
    apikey: "",
  };

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
        <PlayerHandler data={this.state} updateRoute={this.updateRoute}/>
      </div>
    }
    else if(this.state.route == "Table")
    {
      display =  
      <div>
        <TableClass data={this.state} updateRoute={this.updateRoute}/>
      </div>
    }
    return (
      <div className="App">
        <h2 style={{display: 'flex', justifyContent: 'center'}}>Welcome to FUT Player Market</h2>
        {display}
      </div>
    );
  }
}

export default App;
