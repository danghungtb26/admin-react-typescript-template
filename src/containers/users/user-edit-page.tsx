import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { PageContainer } from '@/components/box/page-container'

import { UserEditForm } from './components/user-edit-form'

export function UserEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false })

  const handleSuccess = () => {
    // Navigate back after successful update
    navigate({ to: '/users' })
  }

  const handleCancel = () => {
    navigate({ to: '/users' })
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userId ? t('users.edit_user.page_title') : t('users.create_user.page_title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {userId
              ? t('users.edit_user.page_description')
              : t('users.create_user.page_description')}
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          {t('common.button.back')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {userId ? t('users.edit_user.title') : t('users.create_user.title')}
          </CardTitle>
          <CardDescription>
            {userId ? t('users.edit_user.description') : t('users.create_user.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserEditForm userId={userId} onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
