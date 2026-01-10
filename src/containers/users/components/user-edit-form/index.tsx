import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { useCreateUser } from '@/apis/user/hooks/use-create-user'
import { useUpdateUser } from '@/apis/user/hooks/use-update-user'
import { useUserById } from '@/apis/user/hooks/use-user-by-id'
import { UserEditFormData, userEditSchema } from '@/commons/validates/user'
import { Button } from '@/components/atoms/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { Spinner } from '@/components/atoms/spinner'

export type UserEditFormProps = {
  userId?: string
  onSuccess?: () => void
  onError?: (error: unknown) => void
  onCancel: () => void
}

export function UserEditForm({ userId, onSuccess, onError, onCancel }: UserEditFormProps) {
  const { t } = useTranslation()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const { data: userData, isLoading: isLoadingUser } = useUserById(userId)

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending

  const form = useForm<z.input<typeof userEditSchema>, unknown, z.output<typeof userEditSchema>>({
    // @ts-expect-error zodResolver types issue with zod v4
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      avatar: '',
      birthday: '',
      gender: undefined,
    },
  })

  // Load user data when fetched
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: userData.avatar,
        birthday: userData.birthday,
        gender: userData.gender,
      })
    }
  }, [userData, form])

  const handleSubmit = async (data: UserEditFormData) => {
    try {
      if (userId) {
        await updateUserMutation.mutateAsync({ id: userId, data })
        toast.success(t('users.edit_user.success_message'))
      } else {
        await createUserMutation.mutateAsync(data)
        toast.success(t('users.create_user.success_message'))
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save user:', error)
      toast.error(t('common.error.something_went_wrong'))
      onError?.(error)
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.edit_user.fields.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.edit_user.placeholders.name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.edit_user.fields.email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t('users.edit_user.placeholders.email')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.edit_user.fields.phone')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.edit_user.placeholders.phone')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.edit_user.fields.birthday')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.edit_user.fields.gender')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('users.edit_user.placeholders.gender')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">{t('users.edit_user.gender_options.male')}</SelectItem>
                  <SelectItem value="female">
                    {t('users.edit_user.gender_options.female')}
                  </SelectItem>
                  <SelectItem value="other">{t('users.edit_user.gender_options.other')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.edit_user.fields.avatar')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.edit_user.placeholders.avatar')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common.button.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.button.saving') : t('common.button.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
