import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export const ErrorFallback = () => {
  const { t } = useTranslation();

  return (
    <div className='page'>
      <Alert severity='error' className='mb-16'>{t('something-went-wrong')}</Alert>
      <Link to='/' className='text-align'>Go to home page</Link>
    </div>
  )
}