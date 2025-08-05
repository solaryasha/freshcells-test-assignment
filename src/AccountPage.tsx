import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';

export const AccountPage = () => {
  const { userId }= useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

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

    } finally {}

  }, [userId])

  useEffect(() => {
    setUserInfo()
  }, [setUserInfo])

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return lastName && firstName && (
    <form>
      <p>First name: {firstName}</p>
      <p>Last name: {lastName}</p>
      <button onClick={logOut}>Logout</button>
    </form>
  )
}