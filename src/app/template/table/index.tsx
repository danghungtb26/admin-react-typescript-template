import React from 'react'

import PageAnimation from '@/components/animation/page'
import TableTemplateContainer from '@/containers/template/table'

type TableTemplatePageProps = {}

const TableTemplatePage: React.FC<React.PropsWithChildren<TableTemplatePageProps>> = () => {
  return (
    <PageAnimation>
      <TableTemplateContainer />
    </PageAnimation>
  )
}

export default TableTemplatePage
