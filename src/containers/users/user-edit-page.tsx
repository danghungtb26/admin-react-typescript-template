import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { PageLayout } from '@/components/molecules/page-layout'

import { EditUserForm } from './components/edit-user-form'

export function UserEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false })

  const handleSuccess = () => {
    navigate({ to: '/users' })
  }

  const handleCancel = () => {
    navigate({ to: '/users' })
  }

  if (!userId) {
    navigate({ to: '/users' })
    return null
  }

  return (
    <PageLayout
      title={t('users.edit_user.page_title')}
      description={t('users.edit_user.page_description')}
      actions={
        <Button variant="outline" onClick={handleCancel}>
          {t('common.button.back')}
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('users.edit_user.title')}</CardTitle>
          <CardDescription>{t('users.edit_user.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm userId={userId} onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </PageLayout>
  )
}
