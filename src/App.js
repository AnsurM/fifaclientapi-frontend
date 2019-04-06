import React, { Component } from 'react';
import './App.css';
// import PlayerData from './PlayerData';
import SignIn from './SignIn';
import AdminRecords from './AdminRecords';
import PlayerHandler from './PlayerHandler';
import 'tachyons';
import Register from './Register';

// let cors = require('cors');
// app.use(cors());


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
  
  componentDidMount() {
  }
  

  render() {
    if(this.state.route == "Login")
    {
      display = 
      <div>
          {/* <h1 id = "logo" style={{color: "#FCCA0B", margin: "65px 10px"}}>THE</h1>  */}
          {/* <img 
          // src="https://media.playstation.com/is/image/SCEA/fifa-19-ultimate-team-logo-01-ps4-us-07sep18?$native_t$"
          // src="https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-19/common/fifa19-toty-logo.png"
          src="http://www.farcry5keys.com/images/fifa19-logo.png"
          style={{width: "500px", height: "200px",  margin: "0px 20px", marginTop:"0px",}}
          />  */}
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
          {/* <h1 id = "logo" style={{color: "#FCCA0B", margin: "10px 10px"}}>THE FIFA 19 MARKET</h1>  */}
        <PlayerHandler data={this.state} updateRoute={this.updateRoute}/>
      </div>
    }
    else if(this.state.route == "Table")
    {
      display =  
      <div>
        <AdminRecords data={this.state} updateRoute={this.updateRoute}/>
      </div>
    }

    window.scrollTo(0,0);
    return (
      <div className="App">
        <div className="bg" style={{
          // backgroundImage: "url('https://media.playstation.com/is/image/SCEA/fifa-19-stadium-background-blur-01-ps4-us-08jun18?$native_nt$')"
          // backgroundImage: "url('https://pbs.twimg.com/media/C1KWvW4XAAAXRrI.jpg')",
          // backgroundImage: "url('http://futhdhub.com/wp-content/uploads/2017/08/bgsmall.png')",
           backgroundImage: "url('https://cdn.futview.com/eye_catch/king_power.png')"
          }}>

          {/* <h1 id = "logo" style={{color: "#FCCA0B", padding: "10px 10px"}}>THE  
          <img 
          // src="https://media.playstation.com/is/image/SCEA/fifa-19-ultimate-team-logo-01-ps4-us-07sep18?$native_t$"
          // src="https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-19/common/fifa19-toty-logo.png"
          src="http://www.farcry5keys.com/images/fifa19-logo.png"
          style={{width: "500px", height: "200px",}}
          />  */}
          {/* </h1> */}

          <h1 id = "logo" style={{color: "#FCCA0B", margin: "0px 10px", padding: "10px 0px"}}>THE FIFA 19 MARKET</h1> 
          {display}
        </div>
      </div>
    );
  }
}

export default App;
