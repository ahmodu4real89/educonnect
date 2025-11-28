"use client"
import { Dropdown, MenuProps, Space } from 'antd'
import Link from 'next/link';
import { MoreOutlined } from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <Link href="/">
        Submit
      </Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link href="/">
        Request Extension
      </Link>
    ),
  },
];
export default function AssignmentActionDropdown() {
  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <MoreOutlined />
        </Space>
      </a>
    </Dropdown>
  )
}
