import { createFileRoute } from '@tanstack/react-router'

import TemplateTable from '@/containers/template/table'

export const Route = createFileRoute('/_authenticated/template/table/$id')({
  component: TemplateTable,
  staticData: {
    meta: {
      title: 'Detail template',
      titleKey: 'table.template.title',
    },
  },
})
