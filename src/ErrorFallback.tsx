import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export const ErrorFallback = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Alert severity='error'>{t('something-went-wrong')}</Alert>
      <Link to='/'>Go to home page</Link>
    </div>
  )
}