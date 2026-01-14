import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { PageLayout } from '@/components/molecules/page-layout'

import { CreateUserForm } from './components/create-user-form'

export function UserCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate({ to: '/users' })
  }

  const handleCancel = () => {
    navigate({ to: '/users' })
  }

  return (
    <PageLayout
      title={t('users.create_user.page_title')}
      description={t('users.create_user.page_description')}
      actions={
        <Button variant="outline" onClick={handleCancel}>
          {t('common.button.back')}
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('users.create_user.title')}</CardTitle>
          <CardDescription>{t('users.create_user.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </PageLayout>
  )
}
