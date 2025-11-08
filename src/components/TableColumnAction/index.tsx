import React, { useState } from 'react';
import { Popover, Form, Input, Checkbox, Radio, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

export interface OptionItem {
    label: React.ReactNode;
    value: string | number;
}

export interface TableColumnActionProps {
    title: string;
    mode: 'search' | 'filter';
    onChange: (params: any) => void;
    filterMode?: 'single' | 'multiple';
    options?: OptionItem[];
}
export const TableColumnAction: React.FC<TableColumnActionProps> = ({
    title,
    mode,
    onChange,
    filterMode = 'multiple',
    options = [],
}) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    // 根据模式动态监听表单值
    const watchValue = Form.useWatch(mode === 'search' ? 'searchValue' : 'filter', form);

    // 提交逻辑
    const handleFinish = (values: any) => {
        const value = mode === 'search' ? values?.searchValue : values?.filter;
        onChange({ value });
        setOpen(false);
    };

    const handleReset = () => {
        form.resetFields();
        onChange({ value: undefined });
        setOpen(false);
    };

    const renderFormContent = () => {

        if (mode === 'search') {
            return (
                <Form.Item name="searchValue" style={{ marginBottom: 10 }}>
                    <Input placeholder="请输入搜索内容" allowClear onPressEnter={form.submit} />
                </Form.Item>
            );
        }

        // filter 模式
        return (
            <Form.Item name="filter" style={{ marginBottom: 10 }}>
                {filterMode === 'multiple' ? (
                    <Checkbox.Group
                        options={options}
                        style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
                    />
                ) : (
                    <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {options.map((opt) => (
                            <Radio key={opt.value} value={opt.value}>
                                {opt.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                )}
            </Form.Item>
        );
    };

    const ActionIcon = mode === 'search' ? SearchOutlined : FilterOutlined;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {title}
            <Popover
                placement="bottomRight"
                trigger="click"
                arrow={false}
                open={open}
                onOpenChange={setOpen}
                content={
                    <div>
                        <Form form={form} onFinish={handleFinish}>
                            {renderFormContent()}
                            <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                                <Button size="small" style={{ width: '47%' }} onClick={handleReset} >
                                    重置
                                </Button>
                                <Button type="primary" size="small" style={{ width: '47%' }} onClick={form.submit} >
                                    搜索
                                </Button>
                            </div>
                        </Form>
                    </div>
                }
            >
                <ActionIcon style={{ color: watchValue ? '#1677ff' : '#B9B9B9', cursor: 'pointer' }} />
            </Popover>
        </div>
    );
};
