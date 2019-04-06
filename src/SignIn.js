import React from 'react';
import './SignIn.css';
import constants from './constants';
import Notifications, {notify} from 'react-notify-toast';

const axios = require('axios');

window.onbeforeunload = function() {
  return 'You have unsaved changes!';
}

class SignIn extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      signInEmail: '',
      signInPassword: '',
      apiKey: '',
    }

  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value});
  }

  onSubmitSignIn = () => {

      fetch('https://gentle-everglades-47985.herokuapp.com/signin',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      email: this.state.signInEmail,
      password: this.state.signInPassword
      })
    })
    .then(response => response.json())
    .then(result => {
          if(result.name)
          {            
            this.props.ChangeState('home', result.email, result.name, result.rollno)
          }
          else
          {
            notify.show(result.message);
          }
    })
    .catch(err => notify.show(err.message))

  }

  updateEmailAndApiKey = () =>
  {
    // console.log('email: ', this.state.signInEmail);
    this.props.setEmailAndApiKey(this.state.signInEmail, this.state.apiKey);
  }

   validateLogIn = (route) => {
    let that = this;
    fetch(constants.url + '/signin',{
      method: 'post',
      mode:'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      email: this.state.signInEmail,
      password: this.state.signInPassword,
      })
    })
    .then(response => {
    //    console.log(response);
        if(response.status == 200)
        {          
           fetch(constants.url + '/getApiKey',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                email: this.state.signInEmail,
                })
              })
              .then(response => response.json()) 
              .then(data =>
            {
              // console.log('resp ', data);
              that.setState({signInEmail: data.email});
              that.setState({apiKey: data.apikey});
              that.updateEmailAndApiKey();
              if(this.state.apiKey)
              {
                this.props.updateRoute(route);
              }
            })
            .catch(function (error) {
              console.log("Error: " , error);
              notify.show("There was an error trying to login. Please try again shortly.", "error", 10000);
            });
        }
        else
        {
          if(response.status == 400)
          {
            console.log("Error: " , response);
            notify.show("The login details are invalid. Please re-check and try again.", "warning", 7000);
          }
          else
          {
            console.log("Error: " , response);
            notify.show("There was an error trying to login. Please try again shortly.", "error", 10000);
          }
        }
      })
    .catch(err => {        
      console.log("Error: " , err);
      notify.show("There was an error trying to login. Please try again shortly.", "error", 10000);
    });
}

  validateLogIn1 = (route) => 
  {
    let that = this;
//    notify.show("Logging in. Please wait.", "success", 3000);
//    notify.show("Logging in. Please wait.", "success", 1000);
    axios.post(constants.url + '/signin', {
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      })
      .then(function (response) {
        console.log(response);
        if(response.status == 200)
        {          
           fetch(constants.url + '/getApiKey',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                email: that.state.signInEmail,
                })
              })
              .then(response => response.json()) 
              .then(data =>
            {
              // console.log('resp ', data);
              that.setState({signInEmail: data.email});
              that.setState({apiKey: data.apikey});
              that.updateEmailAndApiKey();
              if(that.state.apiKey)
              {
                that.props.updateRoute(route);
              }
            })
            .catch(function (error) {
              notify.show("Server error occured. Please retry logging in after a few minutes. ", "warning", 5000);
            });
        }
      })
      .catch(function (error) {
        console.log("Login error: ", error);
        let myErr = error.toString();
        if(myErr.includes("400"))
        {
          notify.show("Invalid login credentials detected. Please verify and try again. ", "error", 5000);
        }
        else
        {
          notify.show("Server error occured. Please retry logging in after a few minutes or contact the admin if problem persists.", "warning", 5000);
        }
      });    
  }

 onSubmitSignIn1 = (route) =>
  {
    if(route == "Register")
    {
      this.props.updateRoute(route);
    }
    else
    {
//      notify.show("Logging in. Please wait.", "success", 200);
      this.validateLogIn1(route);
    }
  }

  render(){
    return (
      <div>
        <Notifications />
        <div style={{width: "100%"}}>
          <div>
            <div id="SIGN IN FORM" style={{marginTop:"30px"}}>
            <article className="br3 w-60 mw6 shadow-5 center signinbox">
            <main className="pa4 black-80">
              <div className="measure">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                  <legend className="signIn">Sign In</legend>
                  <div className="mt3">
                    <label className="db fw6 lh-copy f4 myTColor" htmlFor="email-address">Email</label>
                    <input 
                    className="pa2 w-100" 
                    type="email" 
                    name="email-address"  
                    id="email-address"
                    onChange = {this.onEmailChange}
                    />
                  </div>
                  <div className="mv3">
                    <label className="db fw6 lh-copy f4 myTColor" htmlFor="password">Password</label>
                    <input 
                    className="pa2 w-100" 
                    type="password" 
                    name="password"  
                    id="password"
                    onChange = {this.onPasswordChange}

                    />
                  </div>
                <div>
                  <input 
                  onClick = {() => this.onSubmitSignIn1("App")}
                  className="input b ph3 pv2 input-reset ba b--black hover-bg-green grow pointer f6 dib" 
                  type="submit" 
                  value="Sign in"/>
                </div>
                </fieldset>
              </div>
            </main>
            </article>
            </div>
            <div id="OUR INFO" style={{display: "inline-flex", width: "400px", 
              marginTop: "50px", color: "floralwhite", 
              backgroundColor: "rgba(119,136,153, 0.4)",
              borderRadius: "50px"
              }}> 
              <div style={{width:"100%", justifyContent: "center"}}>
                  <div>
                    <h3>Contact Us</h3>
                  </div>
                  <div style={{textAlign: "start", margin: "40px 50px"}}>
                    <div id="Email" style={{display: "flex"}}>
                    <img 
                      src="http://icons.iconarchive.com/icons/cornmanthe3rd/metronome/72/Communication-email-blue-icon.png"
                      width="70px" height="49px"                
                      />
                    <p style={{marginLeft: "30px" , display:"flex", justifyContent: "center"}}>ourcontact@gmail.com</p>
                      
                    </div>
                    <div id="Skype" style={{display: "flex"}}>
                      <img 
                      src="http://www.myiconfinder.com/uploads/iconsets/128-128-3a8444ba64b326d9b5b3728b29ee8171-skype.png" 
                      width="70px" height="70px"/>
                    <p style={{marginLeft: "30px", display:"flex", justifyContent: "center"}}>ourcontact@gmail.com</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  	 );
  }
}
export default SignIn;