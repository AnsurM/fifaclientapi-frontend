import React from 'react';
import constants from './constants';
import './Register.css';
import Notifications, {notify} from 'react-notify-toast';

const bcrypt = require('bcrypt-nodejs');

const axios = require('axios');


class Register extends React.Component {

    constructor(props){
      super(props);

      this.state = {
        email: '',
        password: '',
        name:''
      }

    }

    onNameChange = (event) => {
      this.setState({name: event.target.value});
    }

    onEmailChange = (event) => {
      this.setState({email: event.target.value});
    }

    onPasswordChange = (event) => {
      this.setState({password: event.target.value});
    }

    hasNumber = (myString) => {
      return /\d/.test(myString);
    }

    onSubmitRegistration = () => {

      const {email, password, name} = this.state;
      if(!email || !password || !name)
      {
        if(!email)
        {
          notify.show("Email field can't be empty");
        }
        else if(!password)
        {
          notify.show("Passwod field can't be empty");
        }
        if(!name)
        {
          notify.show("Name field can't be empty");
        }
      }
      else if(this.hasNumber(name))
      {
        alert("Name can only contain alphabets.");
      }
      else
      {

        fetch('https://gentle-everglades-47985.herokuapp.com/register',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name,
          })
        })
        .then(response => response.json())
        .then(user => {
      //    console.log(user);
          if(user === true)
          {        
            alert("Registration successful!");
            this.props.ChangeState2('Administrator','');
          }
          else if (user === false)
          {
            alert("Error entering student!");
          }
          else {
            alert("This user already is registered!");
          }
        })

      }
    }

    async hashString(input){
      var hashWord = "";
      if(input.length > 0)
      {
        hashWord = await bcrypt.hash(input, null, null, function(err, hash) {
            // Store hash in your password DB.
              return hash;
        })
      //  console.log('hashword ', hashWord);
        return await hashWord;
      }
    }

    onSubmitReg2 = () => {

      const {email, password, name} = this.state;
      if(!email || !password || !name)
      {
        if(!email)
        {
          alert("Email field can't be empty");
        }
        if(!password)
        {
          alert("Password field can't be empty");
        }
        if(!name)
        {
          alert("Name field can't be empty");
        }
      }
      else if(this.hasNumber(name))
      {
        alert("Name can only contain alphabets.");
      }
      else
      {
        let myHash = "";
          let that = this;
          bcrypt.hash(this.state.password, null, null, function(err, hash) {
              // Store hash in your password DB.
                if(!err)
                {
                  myHash = hash;
          //        console.log('myHash ', myHash);

          //        console.log('hash ', myHash);
                  if(myHash.length > 0)
                  {
                    axios.post(constants.url + '/register', {
                      email: that.state.email,
                      password: myHash,
                      name: that.state.name,
                    })
                    .then(user => {
                      if(user.status === 200)
                      {        
                        alert("Registration successful!");
                        that.props.updateRoute("Login");
                      }
                      else if (user.status === 400)
                      {
                        alert("This user already is registered!");
                      }
                    })
                    .catch(err => notify.show("The page behaved unexpectedly while trying to register. Please try again shortly.", "error", 10000));
                  }
                  else
                  {
                    notify.show("The page behaved unexpectedly while trying to register. Please try again shortly.", "error", 10000);
                  }
                }
                else
                {
                  notify.show("The page behaved unexpectedly while trying to register. Please try again shortly.", "error", 10000);
                }
        })
      }
    }

    onSubmitReg1 = () =>
  {
    this.props.updateRoute("Login");
  }

    onClickSignInButton = () => {
      this.props.updateRoute("Login");
    }

    render (){
      return (
        <div>
        <Notifications />
        <article className="br3 w-100 w-50-m w-25-l mw6 shadow-5 center registerbox">
        <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0 myTColor">Register</legend>
            <div className="mt1">
              <label className="db fw6 lh-copy f4 myTColor" htmlFor="name">Name</label>
              <input 
              className="pa2 w-100" 
              type="text" 
              name="name"  
              id="name"
              onChange={this.onNameChange}
              />
            </div>
            <div className="mt1">
              <label className="db fw6 lh-copy f4 myTColor" htmlFor="email-address">Email</label>
              <input 
              className="pa2 w-100" 
              type="email" 
              name="email-address"  
              id="email-address"
              onChange={this.onEmailChange}
              />
            </div>
            <div className="mv1">
              <label className="db fw6 lh-copy f4 myTColor" htmlFor="password">Password</label>
              <input 
              className="pa2 w-100" 
              type="password" 
              name="password"  
              id="password"
              onChange={this.onPasswordChange}
              />
            </div>
          </fieldset>
          <div className="">
            <input 
            onClick = {this.onSubmitReg2}
            className="input b ph3 pv2 input-reset ba b--black hover-bg-green grow pointer f6 dib" 
            type="submit" 
            value="Register"/>
            <input 
            onClick = {this.onClickSignInButton}
            className="input b ph3 pv2 input-reset ba b--black hover-bg-green grow pointer f6 dib" 
            type="submit" 
            value="Sign In"/>
          </div>
        </div>
      </main>
      </article>
    </div>
    );

  }

}

export default Register;