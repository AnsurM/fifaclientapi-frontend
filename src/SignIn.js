import React from 'react';
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
            alert("Wrong email/password! Please try again.");
          }
    })
    .catch(err => alert('Invalid credentials'))

  }

  updateEmailAndApiKey = () =>
  {
    // console.log('email: ', this.state.signInEmail);
    this.props.setEmailAndApiKey(this.state.signInEmail, this.state.apiKey);
  }

   validateLogIn = (route) => {
    let that = this;
    fetch('http://localhost:3001/signin',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      email: this.state.signInEmail,
      password: this.state.signInPassword,
      })
    })
    .then(user => {
        if(user.status == 200)
        {          
           fetch('http://localhost:3001/getApiKey',{
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
              console.log('errorrr ', error);
            });
        }
        else
        {
          alert("Invalid login details.");
        }
      })
    .catch(err => {console.log(err)});
}

 onSubmitSignIn1 = (route) =>
  {
    this.validateLogIn(route);
}

  render(){
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input 
              className="entry pa2 input-reset ba bg-transparent hover-bg-black w-100" 
              type="email" 
              name="email-address"  
              id="email-address"
              onChange = {this.onEmailChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input 
              className="entry pa2 input-reset ba bg-transparent hover-bg-black w-100" 
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

  	 );
  }
}
export default SignIn;