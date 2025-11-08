import { Space, TableProps, Tag } from 'antd';
import React from 'react'
import { DataType } from '.';
import { TableColumnAction } from '@/components/TableColumnAction';
interface Iprops {
    onFilter: (...set: any) => void
}
export const Columns = (props: Iprops) => {
    const { onFilter } = props
    const columns: TableProps<DataType>['columns'] = [
        {
            title: <TableColumnAction
                title="姓名"
                mode="search"
                onChange={({ value }) => onFilter({ name: value })}
            />,

            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: <TableColumnAction
                title="状态"
                mode="filter"
                filterMode="multiple"
                options={[
                    { label: '启用', value: 'enabled' },
                    { label: '停用', value: 'disabled' },
                ]}
                onChange={({ value }) => onFilter({ status: value })}
            />,
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: <TableColumnAction
                title="状态"
                mode="filter"
                filterMode='single'
                options={[
                    { label: 'Nice', value: 'Nice' },
                    { label: 'COOL', value: 'COOL' },
                ]}
                onChange={({ value }) => onFilter({ tags: value })}
            />,
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];
    return columns
}

