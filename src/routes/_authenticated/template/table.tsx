import { createFileRoute } from '@tanstack/react-router'

import TemplateTable from '@/containers/template/table'

export const Route = createFileRoute('/_authenticated/template/table')({
  component: TemplateTable,
  staticData: {
    meta: {
      title: 'Table template',
      titleKey: 'table.template.title',
    },
  },
})
