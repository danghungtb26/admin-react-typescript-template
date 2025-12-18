import TemplateTable from '@containers/template/table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/template/table/$id')({
  component: TemplateTable,
})
