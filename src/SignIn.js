import React from 'react';
import './SignIn.css';
import constants from './constants';
import Notifications, {notify} from 'react-notify-toast';

const axios = require('axios');

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
              console.log('errorrr ', error);
            });
        }
        else
        {
          if(response.status == 400)
          {
            notify.show("No data found. Please check your login credentials.");
          }
          else
          {
            notify.show("We are experiencing difficulties logging in. Please try later.");
          }
        }
      })
      .catch(function (error) {
        console.log("Login error: ", error.status);
        notify.show("Error while logging in" + error);
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
      this.validateLogIn1(route);
    }
  }

  render(){
    return (
      <div>
      <Notifications />
      <article className="br3 w-100 w-50-m w-25-l mw6 shadow-5 center signinbox">
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
          <br />
          <div>
            <input 
            onClick = {() => this.onSubmitSignIn1("Register")}
            className="input b ph3 pv2 input-reset ba b--black hover-bg-green grow pointer f6 dib" 
            type="submit" 
            value="Register User"/>
          </div>
          </fieldset>
        </div>
      </main>
      </article>
      </div>
  	 );
  }
}
export default SignIn;