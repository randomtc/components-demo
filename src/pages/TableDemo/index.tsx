import { message, Space, Table, TableProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Columns } from "./Columns";

export interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const mockData = [
    {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
    },
    {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
        tags: ["cool", "teacher"],
    },
];

const TableDemo = () => {

    const [data, setData] = useState<any>([])
    const [filterValues, setFilterValues] = useState<Record<string, any>>({
        current: 1,
        pageSize: 10
    })
    const [loading, setLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const getData = async () => {
        try {
            setLoading(true)
            console.log("🚀 ~ TableDemo ~ filterValues:", filterValues)
            setTimeout(() => {
                setData({
                    data: mockData,
                    total: 105
                })
                setLoading(false)
            }, 500)
        } catch (error) {
            message.error(error as any)
        } finally {

        }

    }
    useEffect(() => {
        getData()
    }, [filterValues])


    return (
        <div>
            <Table<DataType>
                dataSource={data.data}
                columns={Columns(
                    {
                        onFilter: (values) => {
                            setFilterValues({ ...filterValues, ...values })
                        }
                    }
                )}
                loading={loading}
                pagination={{
                    size: 'small',
                    total: data.total,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                    current: filterValues.current,
                    pageSize: filterValues.pageSize,

                    onChange: (page, pageSize) => {
                        setFilterValues({ ...filterValues, current: page, pageSize })
                    }
                }}
            />
        </div>
    );
};

export default TableDemo;
