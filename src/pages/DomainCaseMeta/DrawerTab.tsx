// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Checkbox, Col, Collapse, Radio, Row, Tabs } from 'antd';
import CustomEditor from '../CustomEditor';
import styles from './index.less';
import { modifySubData } from '../utils';
import { CheckCircleOutlined } from 'icons';
import DBCheckContent from '../DBCheckContent';
const { Panel } = Collapse;
const DrawerTab = (props: any) => {
    const { data: propsData, idx: index, searchIdx, loading, onChange } = props;
    const [subData, setSubData] = useState(propsData);
    const [tabKey, setTabKey] = useState<string | number>(0);
    const [expandedKeys, setExpandedKeys] = useState(['entranceInterfaceInfo']);

    useEffect(() => {
        //删除不需要编辑的字段
        if (propsData) {
            setSubData(propsData);
            // console.log('propsData', propsData);
        }
    }, [propsData]);

    const updataSubData = (
        newData: any,
        patchOrUpdates: string | { path: string, value: string | string[] | boolean }[],
        val?: string | string[] | boolean
    ) => {
        let updatedSubData = { ...newData };
        if (typeof patchOrUpdates === 'string' && val !== undefined) {
            // 单一更新
            updatedSubData = modifySubData(updatedSubData, patchOrUpdates, val);

        } else if (Array.isArray(patchOrUpdates)) {
            // 多个更新
            patchOrUpdates.forEach(({ path, value }) => {
                updatedSubData = modifySubData(updatedSubData, path, value);
            });
        }

        onChange({
            tabData: updatedSubData?.tabData,
            tabKey: tabKey,
        });

        setSubData(updatedSubData);
    };

    const isAllSelectMockCheckbox = (myData: Record<string, any>) => {
        const blooenArr = myData?.map((item: any) => item?.needRemoteMock) || [];
        const trueCount = blooenArr.filter(Boolean).length;

        return {
            checked: trueCount === blooenArr.length,
            indeterminate: trueCount > 0 && trueCount < blooenArr.length,
        };
    };


    return (
        <>
            {!(searchIdx === index && loading) && (
            <Tabs
                defaultActiveKey="0"
                onChange={(key: string | number) => {
                    setTabKey(key);
                    onChange({
                        tabData: subData?.tabData,
                        tabKey: key,
                    });
                }}
            >
                {subData?.tabData?.map((item: any, idx: number) => {
                    return (
                        <Tabs.TabPane
                            tab={
                                <>
                                    <span
                                        style={{
                                            color: '#4b6efc',
                                            display: idx === Number(tabKey) ? '' : 'none',
                                            marginRight: -5,
                                        }}
                                    >
                                        <CheckCircleOutlined />
                                    </span>
                                    链路{idx + 1}
                                </>
                            }
                            key={idx}
                        >
                            <Collapse
                                activeKey={expandedKeys} // 控制折叠的面板
                                onChange={keys => setExpandedKeys(keys as string[])}
                            >
                                <Panel
                                    key="entranceInterfaceInfo"
                                    header={
                                        <div>
                                            <span >接口名：{item?.entranceInterfaceInfo?.appName}   |    </span>
                                            <span style={{ wordBreak: 'break-all' }} >
                                                {['RPC', 'HTTP'].includes(item?.entranceInterfaceInfo?.interfaceType)
                                                    ? item?.entranceInterfaceInfo?.interfaceName
                                                    : `${item?.entranceInterfaceInfo?.topic}.${item?.entranceInterfaceInfo?.eventCode}`}

                                            </span>
                                            <span
                                                style={{
                                                    color: 'red',
                                                }}
                                            >
                                                （展开接口详情可进行编辑，并对需要Assert的字段进行勾选）
                                            </span>
                                        </div>
                                    }
                                >
                                    <Row gutter={[16, 0]}>
                                        {item?.entranceInterfaceInfo?.interfaceType === 'MSG' && (
                                            <Col span={24}>
                                                <div style={{ display: 'flex' }}>
                                                    <CustomEditor
                                                        data={{ request: item?.entranceInterfaceInfo?.request }}
                                                        rootNode="request"
                                                        showNode='eventPayload'
                                                        interfaceObj={item?.entranceInterfaceInfo?.interfaceType}
                                                        assertChecked={false}
                                                        editValue={true}
                                                        onChange={(val) => {
                                                            updataSubData(
                                                                subData,
                                                                `tabData.${idx}.entranceInterfaceInfo.request.eventPayload`,
                                                                val?.request?.eventPayload,
                                                            );
                                                        }}
                                                    />
                                                    <CustomEditor
                                                        data={{ request: item?.entranceInterfaceInfo?.request }}
                                                        rootNode="request"
                                                        showNode="properties"
                                                        interfaceObj={item?.entranceInterfaceInfo?.interfaceType}
                                                        assertChecked={false}
                                                        editValue={true}
                                                        onChange={(val) => {
                                                            updataSubData(
                                                                subData,
                                                                `tabData.${idx}.entranceInterfaceInfo.request.properties`,
                                                                val?.request?.properties,
                                                            );
                                                        }}
                                                    />
                                                    <CustomEditor
                                                        data={{ request: item?.entranceInterfaceInfo?.request }}
                                                        rootNode="request"
                                                        showNode="sofaContext"
                                                        interfaceObj={item?.entranceInterfaceInfo?.interfaceType}
                                                        assertChecked={false}
                                                        editValue={true}
                                                        onChange={(val) => {
                                                            updataSubData(
                                                                subData,
                                                                `tabData.${idx}.entranceInterfaceInfo.request.sofaContext`,
                                                                val?.request?.sofaContext,
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                        {item?.entranceInterfaceInfo?.interfaceType === 'RPC' && (
                                            <Col span={24}>
                                                <div style={{ display: 'flex' }}>
                                                    <CustomEditor
                                                        data={{ request: item?.entranceInterfaceInfo?.request }}
                                                        rootNode="request"
                                                        assertChecked={false}
                                                        editValue={true}
                                                        onChange={(val) => {
                                                            updataSubData(
                                                                subData,
                                                                `tabData.${idx}.entranceInterfaceInfo.request.yamlData`,
                                                                val?.request.yamlData,
                                                            );
                                                        }}
                                                    />
                                                    <CustomEditor
                                                        data={{ request: item?.entranceInterfaceInfo?.request }}
                                                        rootNode="request"
                                                        showNode="sofaContext"
                                                        interfaceObj={item?.entranceInterfaceInfo?.interfaceType}
                                                        assertChecked={true}
                                                        editValue={true}
                                                        isAllAssert={true}
                                                        noShowAssert={true}
                                                        noShowConfigSpecialVerif={true}
                                                        selectKey={'sofaContextKeys'}
                                                        selectKeyRootNode={'sofaContext'}
                                                        onChange={(val) => {
                                                            updataSubData(subData, [
                                                                {
                                                                    path: `tabData.${idx}.entranceInterfaceInfo.request.sofaContext`,
                                                                    value: val?.request?.sofaContext,
                                                                },
                                                                {
                                                                    path: `tabData.${idx}.entranceInterfaceInfo.request.sofaContextKeys`,
                                                                    value: val?.request?.assertKeys,
                                                                },
                                                                {
                                                                    path: `tabData.${idx}.entranceInterfaceInfo.request.specialAssertConfigs`,
                                                                    value: val?.request?.specialAssertConfigs,
                                                                }
                                                            ]);
                                                        }}
                                                    />
                                                    <CustomEditor
                                                        data={{ response: item?.entranceInterfaceInfo?.response }}
                                                        rootNode="response"
                                                        assertChecked={true}
                                                        editValue={true}
                                                        isAllAssert={true}
                                                        onChange={(val) => {
                                                            updataSubData(
                                                                subData,
                                                                `tabData.${idx}.entranceInterfaceInfo.response`,
                                                                val?.response,
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                        {item?.entranceInterfaceInfo?.interfaceType === 'HTTP' && (
                                            <Col span={24}>
                                                <div style={{ display: 'flex' }}>
                                                    <CustomEditor
                                                        data={{ request: item?.entranceInterfaceInfo?.request }}
                                                        rootNode="request"
                                                        assertChecked={false}
                                                        editValue={true}
                                                        onChange={(val) => {
                                                            updataSubData(
                                                                subData,
                                                                `tabData.${idx}.entranceInterfaceInfo.request.yamlData`,
                                                                val?.request.yamlData,
                                                            );
                                                        }}
                                                    />
                                                    <CustomEditor
                                                        data={{ request: item?.entranceInterfaceInfo?.request }}
                                                        rootNode="request"
                                                        showNode="headers"
                                                        interfaceObj={item?.entranceInterfaceInfo?.interfaceType}
                                                        assertChecked={true}
                                                        editValue={true}
                                                        isAllAssert={true}
                                                        noShowAssert={true}
                                                        selectKey={'headersKeys'}
                                                        selectKeyRootNode={'headers'}
                                                        onChange={(val) => {
                                                            updataSubData(subData, [
                                                                {
                                                                    path: `tabData.${idx}.entranceInterfaceInfo.request.headers`,
                                                                    value: val?.request?.headers,
                                                                },
                                                                {
                                                                    path: `tabData.${idx}.entranceInterfaceInfo.request.headersKeys`,
                                                                    value: val?.request?.assertKeys,
                                                                },
                                                                {
                                                                    path: `tabData.${idx}.entranceInterfaceInfo.request.specialAssertConfigs`,
                                                                    value: val?.request?.specialAssertConfigs,
                                                                }
                                                            ]);
                                                        }}
                                                    />
                                                    <CustomEditor
                                                        data={{ response: item?.entranceInterfaceInfo?.response }}
                                                        rootNode="response"
                                                        assertChecked={true}
                                                        editValue={true}
                                                        isAllAssert={true}
                                                        onChange={(val) => {
                                                            updataSubData(
                                                                subData,
                                                                `tabData.${idx}.entranceInterfaceInfo.response`,
                                                                val?.response,
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                    </Row>
                                </Panel>
                                <Panel
                                    key="remoteMockInterfaceInfoList"
                                    header={
                                        <div>
                                            <span>域外mock配置</span>
                                            <span
                                                style={{
                                                    color: 'red',
                                                }}
                                            >
                                                （对需要进行域外mock的接口进行勾选，展开接口详情可进行编辑）
                                            </span>
                                            <Checkbox
                                                checked={isAllSelectMockCheckbox(item?.remoteMockInterfaceInfoList)?.checked}
                                                indeterminate={isAllSelectMockCheckbox(item?.remoteMockInterfaceInfoList)?.indeterminate}
                                                onChange={(e) => {
                                                    const upDataArr = item?.remoteMockInterfaceInfoList?.map((_item: any, allIdx: number) => {
                                                        return {
                                                            path: `tabData.${idx}.remoteMockInterfaceInfoList.${allIdx}.needRemoteMock`,
                                                            value: e.target.checked
                                                        }
                                                    })
                                                    updataSubData(subData, upDataArr);
                                                    setExpandedKeys(preState => [...preState, 'remoteMockInterfaceInfoList'])
                                                }}
                                            >
                                                <span style={{ color: '#4a6dfc' }}>Mock 全选</span>
                                            </Checkbox>
                                        </div>
                                    }
                                >
                                    <Collapse ghost>
                                        {item?.remoteMockInterfaceInfoList?.map((rItem: any, rIdx: number) => {
                                            return (
                                                <Panel
                                                    key={`remoteMockInterfaceInfoList${rIdx}`}
                                                    header={
                                                        <div>
                                                            <span>接口名：{rItem?.appName}</span>
                                                            <span style={{ margin: '0 5px' }}>|</span>
                                                            <span style={{ wordBreak: 'break-all' }} >{rItem?.interfaceName}</span>
                                                            <span
                                                                style={{ marginLeft: 5 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={rItem?.needRemoteMock}
                                                                    onChange={(e) => {
                                                                        updataSubData(
                                                                            subData,
                                                                            `tabData.${idx}.remoteMockInterfaceInfoList.${rIdx}.needRemoteMock`,
                                                                            e.target.checked,
                                                                        );
                                                                    }}
                                                                >
                                                                    <span style={{ color: '#4a6dfc' }}>Mock</span>
                                                                </Checkbox>
                                                                <span style={{ marginLeft: 10 }}>mock数据格式：</span>
                                                                <Radio.Group
                                                                    value={(rItem?.yamlMockFile === true || rItem?.yamlMockFile === 'true') ? 'yaml' : 'json'}
                                                                    onChange={e => {
                                                                        e.stopPropagation()
                                                                        console.log(e.target.value);
                                                                        updataSubData(
                                                                            subData,
                                                                            `tabData.${idx}.remoteMockInterfaceInfoList.${rIdx}.yamlMockFile`,
                                                                            e.target.value === 'yaml' ? true : false,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Radio value={'yaml'}>
                                                                        <span style={{ color: '#4a6dfc' }}>yaml</span>
                                                                    </Radio>
                                                                    <Radio value={'json'}>
                                                                        <span style={{ color: '#4a6dfc' }}>json</span>
                                                                    </Radio>
                                                                </Radio.Group>
                                                            </span>
                                                        </div>
                                                    }
                                                >
                                                    <Row gutter={[16, 0]}>
                                                        <Col span={12}>
                                                            {rItem?.request ? (
                                                                <CustomEditor
                                                                    data={{ request: rItem?.request }}
                                                                    rootNode="request"
                                                                    assertChecked={false}
                                                                    editValue={false}
                                                                    onChange={(val) => {
                                                                        updataSubData(
                                                                            subData,
                                                                            `tabData.${idx}.remoteMockInterfaceInfoList.${rIdx}.request`,
                                                                            val?.request,
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span style={{ marginLeft: 28 }}>request</span>
                                                            )}
                                                        </Col>
                                                        <Col span={12}>
                                                            {rItem?.response ? (
                                                                <>
                                                                    {(rItem?.yamlMockFile === true || rItem?.yamlMockFile === 'true') && (
                                                                        <CustomEditor
                                                                            data={{ response: rItem?.response }}
                                                                            rootNode="response"
                                                                            showNode="realYamlData"
                                                                            assertChecked={false}
                                                                            editValue={true}
                                                                            onChange={(val) => {
                                                                                updataSubData(
                                                                                    subData,
                                                                                    `tabData.${idx}.remoteMockInterfaceInfoList.${rIdx}.response.realYamlData`,
                                                                                    val?.response?.realYamlData,
                                                                                );
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {(rItem?.yamlMockFile === false || rItem?.yamlMockFile === 'false') && (
                                                                        <CustomEditor
                                                                            data={{ response: rItem?.response }}
                                                                            assertChecked={false}
                                                                            editValue={true}
                                                                            rootNode="response"
                                                                            onChange={(val) => {
                                                                                updataSubData(
                                                                                    subData,
                                                                                    `tabData.${idx}.remoteMockInterfaceInfoList.${rIdx}.response`,
                                                                                    val?.response,
                                                                                );
                                                                            }}
                                                                        />
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span style={{ marginLeft: 28 }}>response</span>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Panel>
                                            );
                                        })}
                                    </Collapse>
                                </Panel>
                                <Panel
                                    key="outBoundCheckInterfaceInfoList"
                                    header={
                                        <div>
                                            <span>出口报文校验</span>
                                            <span
                                                style={{
                                                    // backgroundColor: 'yellow',
                                                    color: 'red',
                                                }}
                                            >
                                                （展开接口详情可进行编辑，并对需要Assert的字段进行勾选）
                                            </span>
                                        </div>
                                    }
                                >

                                    <Collapse ghost key={`outBoundCheckInterfaceInfoList`}>
                                        {item?.outBoundCheckInterfaceInfoList?.map((oItem: any, oIdx: number) => {
                                            return (
                                                <Panel
                                                    className={styles.collapse}
                                                    key={`outBoundCheckInterfaceInfoList${oIdx}`}
                                                    header={
                                                        <div
                                                            style={{
                                                                backgroundColor: subData?.tabData?.[idx]?.outBoundCheckInterfaceInfoList?.[
                                                                    oIdx
                                                                ]?.request?.assertKeys?.length > 0
                                                                    ? '#cfe6fd' : '#ffffff',
                                                            }}
                                                        >
                                                            <span>接口名：{oItem?.appName}</span>
                                                            <span style={{ margin: '0 5px' }}>|</span>
                                                            <span>{oItem?.interfaceName}</span>
                                                        </div>
                                                    }
                                                >
                                                    <Row gutter={[16, 0]}>
                                                        <Col span={12}>
                                                            {oItem?.request ? (
                                                                <CustomEditor
                                                                    data={{ request: oItem?.request }}
                                                                    rootNode="request"
                                                                    showNode={oItem?.interfaceType === 'MSG' && 'eventPayload'}
                                                                    interfaceObj={oItem?.interfaceType}
                                                                    assertChecked={true}
                                                                    editValue={true}
                                                                    isAllAssert={true}
                                                                    onChange={(val) => {
                                                                        updataSubData(
                                                                            subData,
                                                                            `tabData.${idx}.outBoundCheckInterfaceInfoList.${oIdx}.request`,
                                                                            val?.request,
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span style={{ marginLeft: 28 }}>request</span>
                                                            )}
                                                        </Col>
                                                        <Col span={12}>
                                                            {oItem?.response ? (
                                                                <CustomEditor
                                                                    data={{ response: oItem?.response }}
                                                                    rootNode="response"
                                                                    assertChecked={false}
                                                                    editValue={false}
                                                                    onChange={(val) => {
                                                                        updataSubData(
                                                                            subData,
                                                                            `tabData.${idx}.outBoundCheckInterfaceInfoList.${oIdx}.response`,
                                                                            val?.response,
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span style={{ marginLeft: 28 }}>response</span>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Panel>

                                            );
                                        })}
                                    </Collapse>
                                </Panel>

                                {item?.dbCheckInfoList?.length > 0 && (
                                    <Panel
                                        key="dbCheckInfoList"
                                        header={
                                            <div>
                                                <span>DB校验</span>
                                                <span
                                                    style={{
                                                        // backgroundColor: 'yellow',
                                                        color: 'red',
                                                    }}
                                                >
                                                    （展开详情可以对链路执行过程中涉及的DB操作进行校验）
                                                </span>
                                            </div>
                                        }
                                    >

                                        <Collapse ghost key={`dbCheckInfoList_children`}>
                                            {item?.dbCheckInfoList?.map((dItem: any, dIdx: number) => {
                                                return (
                                                    <Panel
                                                        className={styles.collapse}
                                                        key={`dbCheckInfoList${dIdx}`}
                                                        header={
                                                            <div>
                                                                <span>应用名：{dItem?.appName}</span>
                                                                <span style={{ margin: '0 5px' }}>|</span>
                                                                <span>表名：{dItem?.tableName}</span>
                                                                <span style={{ margin: '0 5px' }}>|</span>
                                                                <span>SQL类型：{dItem?.sqlType}</span>
                                                            </div>
                                                        }
                                                    >
                                                        {dItem && (
                                                            <DBCheckContent
                                                                data={dItem}
                                                                onChange={(val, dbFieldsIndex) => {
                                                                    updataSubData(
                                                                        subData,
                                                                        `tabData.${idx}.dbCheckInfoList.${dIdx}.dbFields.${dbFieldsIndex}`,
                                                                        val,
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    </Panel>

                                                );
                                            })}
                                        </Collapse>
                                    </Panel>
                                )}

                            </Collapse>
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
      )}


        </>
    );
};

export default DrawerTab;