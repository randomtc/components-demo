import { Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Tooltip } from 'antd'
import { DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'

const { TextArea } = Input

const RULE_TYPE: Record<string, string> = {
    IS_NOT_EMPTY: '不为空',
    IS_EMPTY: '为空',
    EQUALS: '==',
    NOT_EQUALS: '!=',
    IN: 'IN',
    NOT_IN: 'NOT_IN',
    GREATER_THAN: '>',
    GREATER_THAN_OR_EQUAL_TO: '>=',
    LESS_THAN: '<',
    LESS_THAN_OR_EQUAL_TO: '<='
}

const ConfigSpecialVerif = (props: any) => {
    const { keyPath, value, specialAssertConfigs = [], onConfirm } = props
    const [form] = Form.useForm()
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<any>()
    const [timer, setTimer] = useState<any>(null)

    useEffect(() => {

        if (open) {
            const item = specialAssertConfigs?.find((item: any) => item?.keyPath === keyPath)

            form.setFieldsValue({
                keyPath,
                value,
                expressList: (!item?.expressList || item?.expressList?.length < 1) ? [{}] : item?.expressList
            })
            formChange()
        }
    }, [open])

    const formChange = () => {
        const formInfo = form.getFieldsValue()
        setFormData(formInfo)

        //去除红色校验文本
        const expressList = formInfo.expressList || [];
        expressList.forEach((item: any, index: number) => {
            if (!item?.expectValue) {
                form.setFields([{ name: ['expressList', index, 'parseFunction'], errors: [] }]);// 清除校验错误信息
            }
            if (!item?.parseFunction) {
                form.setFields([{ name: ['expressList', index, 'expectValue'], errors: [] }]);// 清除校验错误信息
            }
        });
    }

    const onFinish = (vals: any) => {
        const { expressList, ...vs } = vals

        const params = {
            ...vs,
            expressList: expressList?.filter((item: any) => {
                if (['IS_NOT_EMPTY', 'IS_EMPTY'].includes(item?.operator)) {
                    return item?.parseFunction
                }
                return (item?.parseFunction && item?.expectValue)
            })
        }
        // console.log('params---', params);

        onConfirm(params);
        setOpen(false);
    }

    return (
        <div
            style={{ display: 'inline-block' }}
            onClick={(e) => {
                e.stopPropagation()
            }}
        >
            <Tooltip title='配置特殊校验'>
                <a style={{ cursor: 'pointer' }} onClick={(e) => setOpen(true)}>
                    <SettingOutlined />
                </a >
            </Tooltip>

            <Modal
                title='配置特殊校验'
                width={650}
                style={{
                    // filter: 'invert(0.85) hue-rotate(170deg)'
                }}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => {
                    form.submit()
                }}
            >
                <Form form={form}
                    onFinish={onFinish}
                // initialValues={{ expressList: [{}] }}
                >
                    <Form.Item label='字段路径' name='keyPath'>
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label='数据详情' name='value'>
                        <TextArea placeholder='输入' disabled />
                    </Form.Item>

                    <Divider />

                    <Form.List name="expressList">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={[8, 6]}>
                                        <Col span={24}>
                                            <Form.Item
                                                {...restField}
                                                label={'解析函数'}
                                                name={[name, 'parseFunction']}
                                                rules={[{
                                                    required: ['IS_NOT_EMPTY', 'IS_EMPTY'].includes(formData?.expressList?.[name]?.operator) ? true : formData?.expressList?.[name]?.expectValue,
                                                    message: '请输入'
                                                }]}
                                                required={false}
                                            >
                                                <TextArea
                                                    rows={3}
                                                    placeholder='输入'
                                                    onChange={() => {
                                                        if (timer) {
                                                            clearTimeout(timer);
                                                        }
                                                        const newTimer = setTimeout(() => {
                                                            formChange()
                                                        }, 300);
                                                        setTimer(newTimer);
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                label={'校验规则'}
                                                name={[name, 'operator']}
                                                initialValue={'EQUALS'}
                                            >
                                                <Select
                                                    onSelect={() => {
                                                        formChange()
                                                    }}
                                                    showSearch
                                                    dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                    placeholder="请选择"
                                                    options={Object.entries(RULE_TYPE).map((item) => ({
                                                        value: item[0],
                                                        label: item[1]
                                                    }))}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={15}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'expectValue']}
                                                rules={[{
                                                    required: ['IS_NOT_EMPTY', 'IS_EMPTY'].includes(formData?.expressList?.[name]?.operator) ? false : formData?.expressList?.[name]?.parseFunction,
                                                    message: '请输入'
                                                }]}
                                            >
                                                {['GREATER_THAN', 'GREATER_THAN_OR_EQUAL_TO', 'LESS_THAN', 'LESS_THAN_OR_EQUAL_TO'].includes(formData?.expressList?.[name]?.operator) ? (
                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        placeholder="输入（数字）"
                                                        disabled={['IS_NOT_EMPTY', 'IS_EMPTY'].includes(formData?.expressList?.[name]?.operator)}
                                                        onChange={() => {
                                                            if (timer) {
                                                                clearTimeout(timer);
                                                            }
                                                            const newTimer = setTimeout(() => {
                                                                formChange()
                                                            }, 300);
                                                            setTimer(newTimer);
                                                        }}
                                                    />
                                                ) : (
                                                    <Input
                                                        placeholder={['NOT_IN', 'IN'].includes(formData?.expressList?.[name]?.operator) ? '多个值请用英文逗号分隔' : '输入'}
                                                        disabled={['IS_NOT_EMPTY', 'IS_EMPTY'].includes(formData?.expressList?.[name]?.operator)}
                                                        onChange={() => {
                                                            if (timer) {
                                                                clearTimeout(timer);
                                                            }
                                                            const newTimer = setTimeout(() => {
                                                                formChange()
                                                            }, 300);
                                                            setTimer(newTimer);
                                                        }}
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}>
                                            <DeleteOutlined
                                                style={{
                                                    color: 'red',
                                                    marginTop: 8,
                                                    fontSize: 16,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    remove(name)
                                                    formChange()
                                                }}
                                            />
                                        </Col>
                                        <Divider style={{ marginTop: -10 }} />
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        style={{ width: '100%' }}
                                        type="dashed"
                                        onClick={() => { add() }}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        添加规则
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    )
}

export default ConfigSpecialVerif