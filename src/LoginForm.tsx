import { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setEmailError(t("empty-email-error-text"));
      return;
    }

    if (!emailRegExp.test(email)) {
      setEmailError(t("email-not-matching-error-text"));
      return;
    }

    if (!password) {
      setPasswordError(t('empty-password-error-text'))
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
            }) { 
              jwt 
              user { id } 
            }
          }`
        })
      });
  
      const { data } = await request.json();
      localStorage.setItem('token', data.login.jwt);
      const userId = data.login.user.id;

      navigate(userId);
    } finally {
      setEmail('');
      setPassword('');
    }
  };


  return (
    <form className='form-page' onSubmit={handleSubmit}>
      <div className='form-field'>
        <label htmlFor='email-input'>{t('email-label')}</label>
        <input type="email" name="email-input" id="email-input" value={email} onChange={(event) => {
          setEmail(event.target.value)
          setEmailError('');
        }
        } required />
        {emailError && <p className='error'>{emailError}</p>}
      </div>
      <div className='form-field'>
        <label htmlFor='password-input'>{t('password-label')}</label>
        <input type='password' name="password-input" id="password-input" value={password} onChange={(event) => {
          setPassword(event.target.value);
          setPasswordError('');
        }} />
        {passwordError && <p className='error'>{passwordError}</p>}
      </div>
      <button type="submit">{t('login-button-text')}</button>
    </form>
  )
}