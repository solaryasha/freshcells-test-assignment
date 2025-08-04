import { useState } from 'react';
import './LoginForm.css';

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setEmailError('Email cannot be empty, please provide the email');
      return;
    }

    if (!emailRegExp.test(email)) {
      setEmailError('Value that you provided doesn\'t match email pattern. Make sure you provided an email');
      return;
    }

    if (!password) {
      setPasswordError('Password cannot be empty, please provide the passwrod')
      return;
    }
    try {
      const request = await fetch('https://cms.trial-task.k8s.ext.fcse.io/graphql', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `
            mutation login {
            login(input:{
              identifier: "${email}"
              password: "${password}"
            }) { jwt }
          }`
        })
      });
  
      const { data } = await request.json();
      localStorage.setItem('token', data.login.jwt);

    } finally {
      setEmail('');
      setPassword('');
    }

  };


  return (
    <form className='form-page' onSubmit={handleSubmit}>
      <div className='form-field'>
        <label htmlFor='email-input'>Email: </label>
        <input type="email" name="email-input" id="email-input" value={email} onChange={(event) => {
          setEmail(event.target.value)
          setEmailError('');
        }
        } required />
        {emailError && <p className='error'>{emailError}</p>}
      </div>
      <div className='form-field'>
        <label htmlFor='password-input'>Password: </label>
        <input type='password' name="password-input" id="password-input" value={password} onChange={(event) => {
          setPassword(event.target.value);
          setPasswordError('');
        }} />
        {passwordError && <p className='error'>{passwordError}</p>}
      </div>
      <button type="submit">Login</button>
    </form>
  )
}