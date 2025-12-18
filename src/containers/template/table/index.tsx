import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Button, Divider, Table, Tag } from 'antd'
import React from 'react'

import TableSearch from './components/search'

import { PageContainer } from '@/components/box/page-container'

const { Column } = Table

type TableTemplateContainerProps = {}

const TableTemplateContainer: React.FC<
  React.PropsWithChildren<TableTemplateContainerProps>
> = () => {
  return (
    <PageContainer>
      <TableSearch />
      <br />
      <Table rowKey={i => i.id} dataSource={[{ id: 1 }]}>
        <Column title="序号" dataIndex="id" key="id" width={200} align="center" />
        <Column title="标题" dataIndex="title" key="title" width={200} align="center" />
        <Column title="作者" dataIndex="author" key="author" width={100} align="center" />
        <Column title="阅读量" dataIndex="readings" key="readings" width={195} align="center" />
        <Column title="推荐指数" dataIndex="star" key="star" width={195} align="center" />
        <Column
          title="状态"
          dataIndex="status"
          key="status"
          width={195}
          align="center"
          render={status => {
            const color = status === 'published' ? 'green' : status === 'deleted' ? 'red' : ''
            return (
              <Tag color={color} key={status}>
                {status}
              </Tag>
            )
          }}
        />
        <Column title="时间" dataIndex="date" key="date" width={195} align="center" />
        <Column
          title="操作"
          key="action"
          width={195}
          align="center"
          render={() => (
            <span>
              <Link
                to="/template/table/1"
                state={{
                  aaa: 's',
                }}
              >
                <Button type="primary" shape="circle" icon={<EditOutlined />} title="编辑" />
              </Link>
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon={<DeleteOutlined />} danger title="删除" />
            </span>
          )}
        />
      </Table>
    </PageContainer>
  )
}

export default TableTemplateContainer
