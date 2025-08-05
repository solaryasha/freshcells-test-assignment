import { Button, Input } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

export const AccountPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  const [error, setError] = useState<Error| null>(null);

  if (error) {
    throw error;
  }

  const setUserInfo = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
      return;
    }

    try {
      const request = await fetch('https://cms.trial-task.k8s.ext.fcse.io/graphql', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `{
                user(id: ${userId}) {
                  firstName
                  lastName
                }}`
        })
      });
  
      const { data } = await request.json();
  
      setFirstName(data.user.firstName)
      setLastName(data.user.lastName);
    } catch (error) {
      setError(error as Error);
    }

  }, [userId])

  useEffect(() => {
    setUserInfo()
  }, [setUserInfo])

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return lastName && firstName && (
    <form className='page'>
      <Input defaultValue={firstName} disabled className='mb-16' disableUnderline/>
      <Input defaultValue={lastName} disabled className='mb-16' disableUnderline />
      <Button variant="outlined" onClick={logOut}>{t('logout-button-text')}</Button>
    </form>
  )
}