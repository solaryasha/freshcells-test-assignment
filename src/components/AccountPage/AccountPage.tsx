import { Button, CircularProgress, Input } from '@mui/material';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import './AccountPage.css';

export const AccountPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState();

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  useEffect(() => {
    let isMounted = true;

    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      setLoading(true);
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

        const { data, errors } = await request.json();

        if (errors) {
          setError(new Error(errors[0]?.message || 'Unknown error'));
          return;
        }

        if (isMounted) {
          setFirstName(data.user.firstName);
          setLastName(data.user.lastName);
        }
      } catch (error) {
        if (isMounted) setError(error as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [userId, navigate]);

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <form className='page'>
      {loading ? (<CircularProgress className='progress' />) : (
        <>
          <Input defaultValue={firstName} disabled className='mb-16' disableUnderline aria-label={firstName} />
          <Input defaultValue={lastName} disabled className='mb-16' disableUnderline aria-label={lastName} />
          <Button variant="outlined" onClick={logOut}>{t('logout-button-text')}</Button>
        </>
      )}
    </form>
  )
}