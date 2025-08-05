import { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";
import { Alert, Button, Collapse, TextField } from '@mui/material';

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const initialErrorState = {
  password: {
    status: '',
    message: ''
  },
  email: {
    status: '',
    message: ''
  }
};

const getErrorCode = (errors: Error[]) => {
  if (errors?.some(error => error.message === "Bad Request")) {
    return 'invalid-email-password'
  }

  return 'something-went-wrong'
}

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(initialErrorState);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();

    if (!email) {
      setError(err => ({ ...err, email: { status: 'error', message: t("empty-email-error-text") } }));
      return;
    }

    if (!emailRegExp.test(email)) {
      setError(err => ({ ...err, email: { status: 'error', message: t("email-not-matching-error-text") } }));
      return;
    }

    if (!password) {
      setError(err => ({ ...err, password: { status: 'error', message: t("empty-password-error-text") } }));
      return;
    }

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

    const { data, errors } = await request.json();
    if (data) {
      localStorage.setItem('token', data.login.jwt);
      const userId = data.login.user.id;

      setLoading(false);
      navigate(userId);
    } else {
      const errorCode = getErrorCode(errors);
      setError({ email: { status: 'error', message: t(errorCode) }, password: { status: 'error', message: ''}});
      setLoading(false);
    }
  };

  const hasErrors = Boolean(error.email.message || error.password.message);

  return (
    <form className='page' onSubmit={handleSubmit}>
      <div className='form-field'>
        <TextField
          type="email"
          name="email-input"
          value={email}
          label={t('email-label')}
          onChange={(event) => {
            setEmail(event.target.value)
            setError(err => ({ ...err, email: { status: '', message: '' } }));
          }}
          required
          size="small"
          fullWidth
          color={error.email.status as 'error' | 'success' || 'primary'}
        />
      </div>
      <div className='form-field'>
        <TextField
          type="password"
          name="password-input"
          value={password}
          label={t('password-label')}
          onChange={(event) => {
            setPassword(event.target.value);
            setError(err => ({ ...err, password: { status: '', message: '' } }));
          }}
          required
          size="small"
          fullWidth
        />
      </div>
      {<Collapse in={hasErrors}>
          <Alert severity="error" className='form-field'>
            {error.email.message}
            {error.password.message}
          </Alert>
        </Collapse>
        }
      <Button variant="outlined" type='submit' loading={loading}>{t('login-button-text')}</Button>
    </form>
  )
}