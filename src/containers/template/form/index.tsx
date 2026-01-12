'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Checkbox } from '@/components/atoms/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Slider } from '@/components/atoms/slider'
import { Switch } from '@/components/atoms/switch'
import { Textarea } from '@/components/atoms/textarea'
import { DatePicker } from '@/components/molecules/date-picker'
import { DateRangePicker } from '@/components/molecules/date-range-picker'
import { OTPInput } from '@/components/molecules/input-otp'
import { RadioGroupField } from '@/components/molecules/radio-group'
import { Select } from '@/components/molecules/select'

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  bio: z.string().optional(),
  age: z.number().min(1).max(150).optional(),
  country: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  hobbies: z.array(z.string()).optional(),
  birthday: z.date().optional(),
  vacationDates: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  newsletter: z.boolean().optional(),
  notification: z.boolean().optional(),
  volume: z.number().min(0).max(100).optional(),
  otpCode: z.string().length(6).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function FormTemplateContainer() {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const form = useForm<FormValues>({
    // @ts-expect-error TS2345: Argument of type 'Resolver<FormValues, any, undefined>' is not assignable to parameter of type 'Resolver<FormValues, any>'.
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      bio: '',
      hobbies: [],
      newsletter: false,
      notification: true,
      volume: 50,
    },
  })

  const onSubmit = (values: FormValues) => {
    console.log(values)
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t('template.form.title')}</h1>
        <p className="text-muted-foreground">{t('template.form.description')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>{t('template.form.sections.basic_inputs')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('template.form.labels.username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('template.form.placeholders.username')} {...field} />
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
                    <FormLabel>{t('template.form.labels.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('template.form.placeholders.email')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('template.form.labels.password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('template.form.placeholders.password')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('template.form.labels.bio')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('template.form.placeholders.bio')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('template.form.labels.age')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('template.form.placeholders.age')}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Selections & Choices */}
          <Card>
            <CardHeader>
              <CardTitle>{t('template.form.sections.selections')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('template.form.labels.country')}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t('template.form.placeholders.select_country')}
                        className="w-full"
                        options={[
                          {
                            value: 'us',
                            label: t('template.form.options.countries.us'),
                          },
                          {
                            value: 'uk',
                            label: t('template.form.options.countries.uk'),
                          },
                          {
                            value: 'ca',
                            label: t('template.form.options.countries.ca'),
                          },
                          {
                            value: 'au',
                            label: t('template.form.options.countries.au'),
                          },
                          {
                            value: 'de',
                            label: t('template.form.options.countries.de'),
                          },
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('template.form.labels.gender')}</FormLabel>
                    <FormControl>
                      <RadioGroupField
                        options={[
                          { value: 'male', label: t('template.form.options.gender.male') },
                          { value: 'female', label: t('template.form.options.gender.female') },
                          { value: 'other', label: t('template.form.options.gender.other') },
                        ]}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hobbies"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>{t('template.form.labels.hobbies')}</FormLabel>
                    </div>
                    {[
                      { id: 'reading', label: t('template.form.options.hobbies.reading') },
                      { id: 'sports', label: t('template.form.options.hobbies.sports') },
                      { id: 'music', label: t('template.form.options.hobbies.music') },
                      { id: 'travel', label: t('template.form.options.hobbies.travel') },
                      { id: 'cooking', label: t('template.form.options.hobbies.cooking') },
                    ].map(hobby => (
                      <FormField
                        key={hobby.id}
                        control={form.control}
                        name="hobbies"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={hobby.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(hobby.id)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([...(field.value || []), hobby.id])
                                      : field.onChange(
                                          field.value?.filter(value => value !== hobby.id),
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{hobby.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle>{t('template.form.sections.date_time')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('template.form.labels.birthday')}</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('template.form.placeholders.select_date')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>{t('template.form.labels.vacation_dates')}</Label>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder={t('template.form.placeholders.select_date_range')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>{t('template.form.sections.advanced')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('template.form.labels.newsletter')}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('template.form.labels.notification')}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('template.form.labels.volume')}: {field.value}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={vals => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otpCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('template.form.labels.otp_code')}</FormLabel>
                    <FormControl>
                      <OTPInput maxLength={6} {...field} />
                    </FormControl>
                    <FormDescription>{t('template.form.placeholders.otp_code')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit">{t('template.form.actions.submit')}</Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              {t('template.form.actions.reset')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
