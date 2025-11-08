import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Popover, Radio } from 'antd';
import React, { useCallback, useState } from 'react';

interface ColumnSearchProps {
    onSearch: (values: Record<string, any>) => void;
}

const ColumnSearch: React.FC<ColumnSearchProps> = ({ onSearch }) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    const onFinish = useCallback(
        (values: any) => {
            onSearch(values);
            setOpen(false);
        },
        [onSearch],
    );

    const resetSearch = useCallback(() => {
        form.resetFields();
        onSearch({});
        setOpen(false);
    }, [form, onSearch]);

    return (
        <Popover
            placement="bottomRight"
            trigger="click"
            arrow={false}
            open={open}
            onOpenChange={(newOpen: boolean) => {
                setOpen(newOpen);
            }}
            content={
                <div>
                    <Form form={form} onFinish={onFinish}>
                        <Form.Item name="value">
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: -15,
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={form.submit}
                                size="small"
                                style={{ width: '47%' }}
                                icon={<SearchOutlined />}
                            >
                                搜索
                            </Button>
                            <Button
                                onClick={resetSearch}
                                size="small"
                                style={{ width: '47%' }}
                            >
                                重置
                            </Button>
                        </div>
                    </Form>
                </div>
            }
        >
            <SearchOutlined
                style={{ color: form.getFieldValue('value') ? '#1677ff' : '#B9B9B9' }}
            />
        </Popover>
    );
};

interface ColumnFilterProps {
    options: Record<'label' | 'value', any>[];
    onFilter: (selectedValues: Record<string, any>) => void;
    mode?: 'single' | 'multiple';
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
    options,
    onFilter,
    mode = 'multiple',
}) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const onFinish = useCallback(
        (values: any) => {
            onFilter(values);
            setOpen(false);
        },
        [onFilter],
    );

    const resetFilters = useCallback(() => {
        form.resetFields();
        onFilter({});
        setOpen(false);
    }, [form, onFilter]);

    return (
        <Popover
            placement="bottomRight"
            trigger="click"
            arrow={false}
            open={open}
            onOpenChange={setOpen}
            content={
                <div>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item name="filter">
                            {mode === 'multiple' ? (
                                <Checkbox.Group
                                    options={options}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
                                />
                            ) : (
                                <Radio.Group
                                    style={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                                >
                                    {options.map((option) => (
                                        <Radio key={option.value} value={option.value}>
                                            {option.label}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        </Form.Item>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: -15,
                            }}
                        >
                            <Button
                                onClick={resetFilters}
                                size="small"
                                style={{ width: '47%' }}
                            >
                                重置
                            </Button>
                            <Button
                                type="primary"
                                onClick={form.submit}
                                size="small"
                                style={{ width: '47%' }}
                            >
                                搜索
                            </Button>
                        </div>
                    </Form>
                </div>
            }
        >
            <FilterOutlined
                style={{
                    color: form.getFieldValue('filter') ? '#1677ff' : '#B9B9B9',
                }}
            />
        </Popover>
    );
};

export const TableHeaderSearch = (
    props: ColumnSearchProps & {
        title: string;
        searchKey: string;
    },
) => {
    const { title, searchKey, onSearch } = props;
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            {title}
            <ColumnSearch
                onSearch={(values: any) => {
                    onSearch({ [searchKey]: values?.value });
                }}
            />
        </div>
    );
};

export const TableHeaderFilter = (
    props: ColumnFilterProps & {
        title: string;
        searchKey: string;
    },
) => {
    const { title, searchKey, onFilter, mode, options } = props;
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            {title}
            <ColumnFilter
                mode={mode}
                options={options}
                onFilter={(values: any) => {
                    onFilter({ [searchKey]: values?.filter });
                }}
            />
        </div>
    );
};