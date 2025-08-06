import { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";
import { Alert, Button, Collapse, TextField } from '@mui/material';

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Error type
interface LoginError {
  field?: 'email' | 'password';
  message: string;
}

const getErrorCode = (errors: Error[]) => {
  if (errors?.some(error => error.message === "Bad Request")) {
    return 'invalid-email-password'
  }

  return 'something-went-wrong'
}

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LoginError | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validate = (): LoginError | null => {
    if (!email) return { field: 'email', message: t("empty-email-error-text") };
    if (!emailRegExp.test(email)) return { field: 'email', message: t("email-not-matching-error-text") };
    if (!password) return { field: 'password', message: t("empty-password-error-text") };
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
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
      const { data, errors } = await request.json();
      if (data) {
        localStorage.setItem('token', data.login.jwt);
        const userId = data.login.user.id;

        navigate(userId);
      } else {
        setError({ message: t(getErrorCode(errors)) });
      }
    } catch {
      setError({ message: t('something-went-wrong') });
    } finally {
      setLoading(false);
    }
  };

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
            setError(null);
          }}
          required
          size="small"
          fullWidth
          error={error?.field === 'email'}
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
            setError(null);
          }}
          required
          size="small"
          fullWidth
          error={error?.field === 'password'}
        />
      </div>
      {<Collapse in={!!error}>
        <Alert severity="error" className='form-field'>
          {error?.message}
        </Alert>
      </Collapse>
      }
      <Button variant="outlined" type='submit' loading={loading}>
        {t('login-button-text')}
      </Button>
    </form>
  )
}