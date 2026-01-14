import { zodResolver } from '@hookform/resolvers/zod'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod/v4'

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

export type UserFormProps = {
  defaultValues?: Partial<UserEditFormData>
  onSubmit: (data: UserEditFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export type UserFormRef = {
  form: UseFormReturn<UserEditFormData>
  submit: () => void
}

export const UserForm = forwardRef<UserFormRef, UserFormProps>(
  ({ defaultValues, onSubmit, onCancel, isSubmitting }, ref) => {
    const { t } = useTranslation()

    const form = useForm<z.input<typeof userEditSchema>, unknown, z.output<typeof userEditSchema>>({
      // @ts-expect-error zodResolver types issue with zod v4
      resolver: zodResolver(userEditSchema),
      defaultValues: {
        name: defaultValues?.name || '',
        email: defaultValues?.email || '',
        phone: defaultValues?.phone || '',
        avatar: defaultValues?.avatar || '',
        birthday: defaultValues?.birthday || '',
        gender: defaultValues?.gender,
      },
    })

    useImperativeHandle(ref, () => ({
      form,
      submit: form.handleSubmit(onSubmit),
    }))

    // Reset form when defaultValues change (e.g. data loaded)
    useEffect(() => {
      if (defaultValues) {
        form.reset({
          name: defaultValues.name || '',
          email: defaultValues.email || '',
          phone: defaultValues.phone || '',
          avatar: defaultValues.avatar || '',
          birthday: defaultValues.birthday || '',
          gender: defaultValues.gender,
        })
      }
    }, [defaultValues, form])

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
                    <SelectItem value="other">
                      {t('users.edit_user.gender_options.other')}
                    </SelectItem>
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
  },
)

UserForm.displayName = 'UserForm'
