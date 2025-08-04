import { useCallback, useEffect, useState } from 'react'

export const AccountPage = () => {
  const id = 2;
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  const setUserInfo = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const request = await fetch('https://cms.trial-task.k8s.ext.fcse.io/graphql', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `{
              user(id: ${id}) {
                firstName
                lastName
              }}`
          })
        });
  
        const { data } = await request.json();
        
        setFirstName(data.user.firstName)
        setLastName(data.user.lastName);

    } finally {}

  }, [])

  useEffect(() => {
    setUserInfo()
  }, [setUserInfo])

  return lastName && firstName && (
    <form>
      <p>First name: {firstName}</p>
      <p>Last name: {lastName}</p>
      <button>Logout</button>
    </form>
  )
}