import { createFileRoute } from '@tanstack/react-router'

import FormTemplateContainer from '@/containers/template/form'

export const Route = createFileRoute('/_authenticated/template/form')({
  component: FormTemplateContainer,
  staticData: {
    meta: {
      title: 'Form template',
      titleKey: 'template.form.title',
    },
  },
})
