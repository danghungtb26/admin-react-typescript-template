import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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

export type UserEditFormProps = {
  userId?: string
  onSubmit: (data: UserEditFormData) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function UserEditForm({ userId, onSubmit, onCancel, isSubmitting }: UserEditFormProps) {
  const { t } = useTranslation()

  const form = useForm<UserEditFormData>({
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

  // Load user data when userId changes
  useEffect(() => {
    if (userId) {
      // TODO: Fetch user data by userId
      // For now, using mock data
      form.reset({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(414) 907-1274',
        avatar: 'https://github.com/shadcn.png',
        birthday: '1990-01-01',
        gender: 'male',
      })
    }
  }, [userId, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
