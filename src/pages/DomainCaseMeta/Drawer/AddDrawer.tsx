// @ts-nocheck
import {
    DoubleRightOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import {
    Button,
    Col,
    Collapse,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
    Tooltip,
} from 'antd';
import React, { useState } from 'react';
import {
    Card,
    Checkbox,
    Divider,
    Popconfirm,
    TreeSelect,
    message,
    AutoComplete,
    Radio,
} from '@alipay/bigfish/antd';
import DrawerTab from './DrawerTab';
import { useEffect, useRef } from '@alipay/bigfish/react';
import { checkSideParam, compareVersions } from '../utils';
import {
    createDomainCaseByPlugin,
    queryDomainLinkDetail,
} from '@/services/DataBank/IndomainUseCase/domainCase';
import { queryBasicInfoByTraceId } from '@/services/DataBank/TrClient';
import { throttle } from '@alipay/bigfish/util/lodash';
import style from './index.less';
import { websocketClient } from '../../WebSocket';
import CustomToolTip from '@/components/CustomToolTip';
import { pluginParams } from '../../WebSocket/utils';


const { Panel } = Collapse;
interface IProps {
    open: boolean;
    treeNode?: any;
    onClose: () => void;
    onSuccess?: (...set: any) => void;
    type?: string;
    editInfo?: any;
    isClick: boolean;
    testFunctionPath?: string
}
const AddDrawer = (props: IProps) => {
    const urlInfoRef = useRef(checkSideParam(location.search));
    const { open, treeNode, onClose, onSuccess, type, editInfo, isClick } = props;
    // console.log('props',props);
    const [form] = Form.useForm();
    const [activeKey, setActiveKey] = useState<string[] | string>(['0']);
    const [tabData, setTabData] = useState<any>([]);
    //区分Step查询项
    const [searchIdx, setSearchIdx] = useState<string | number>();
    const [searchTableLoading, setSearchTableLoading] = useState<boolean>(false);
    const [content, setContent] = useState<any>({});
    const [interfaceList, setInterfaceList] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);
    const [treeData, setTreeData] = useState<any>();
    const [value, setValue] = useState<string>();
    const [interfaceObj, setInterfaceObj] = useState<any>({});
    const [loaded, setLoaded] = useState(30);
    const [selectData, setSelectData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [currentDir, setCurrentDir] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [groupIdValue, setGroupIdValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [options, setOptions] = useState([]);
    const [generateType, setGenerateType] = useState('newTestClass')
    const [topicEventCode, setTopicEventCode] = useState('')
    const newTreeData = (data: any): any => {
        const result = [];
        for (const item of data) {
            const returnItem = {
                ...item,
                // value: String(item?.id),
                key: String(item?.id), // 唯一的 key
                value: String(item?.id), // 使用唯一的 id 作为 value
                title: item?.title, // 可展示的名称
                disabled: item?.leaf,
            };
            if (item?.children) {
                result.push({
                    ...returnItem,
                    children: newTreeData(item?.children),
                });
            } else {
                result.push(returnItem);
            }
        }
        return result;
    };
    const onCanael = () => {
        form.setFieldsValue({
            caseName: '',
            caseDesc: '',
            stepList: [{}],
            testFunctionPath: null,
        });
        setInputValue('');
        setOptions(selectData.slice(0, 30));
        setLoaded(30);
        setContent({});
        setInterfaceList({});
        setTabData([]);
        onClose?.();
    };

    // function getSelectionInfo() {
    //   if (window?.cefQuery) {
    //     window?.cefQuery({
    //       // query 传json
    //       request: JSON.stringify({ operation: 'QUERY_DIRS' }),
    //       onSuccess: function (response: any) {
    //         const { dirs, currentDir: newCurrentDir } = JSON.parse(response);

    //         if (dirs.length > 0) {
    //           const data: any = [];
    //           dirs.map((item: any) => {
    //             data.push({
    //               label: item,
    //               value: item,
    //             });
    //           });

    //           setSelectData(data);
    //           // localStorage.setItem('selectData', JSON.stringify(dirs));
    //           setCurrentDir(newCurrentDir);
    //         } else {
    //           setSelectData([]);
    //         }
    //       },
    //       onFailure: function (error_code: any, error_message: string) { },
    //     });
    //   } else {
    //   }
    // }
    const handleInputChange = throttle((name, value, entranceAppName?: any) => {
        queryBasicInfoByTraceId({ traceId: value })
            .then((res) => {
                // if (Object.keys(res?.content).length) {
                if (res.success) {
                    setContent({ ...content, [name]: res?.content });
                    if (entranceAppName) {
                        setInterfaceList({ ...interfaceList, [name]: res?.content[entranceAppName] });
                    }
                } else {
                    message.error({ content: res.errorMsg, className: style.message });
                    const stepList = form.getFieldValue('stepList');
                    const newStepList = JSON.parse(JSON.stringify(stepList));
                    newStepList[name] = {
                        ...newStepList[name],
                        domainAppList: undefined,
                        entranceAppName: undefined,
                        entranceInterfaceName: undefined,
                    };
                    form.setFieldValue('stepList', newStepList);
                    setContent({ ...content, [name]: {} });
                    setInterfaceList({ ...interfaceList, [name]: null });
                }
            })
            .catch((e) => { })
            .finally(() => {
                setLoading(false);
            });
    }, 1500);


    const onSearchTabData = async (idx: number) => {
        try {

            const errRes = await form.validateFields([
                ['stepList', idx, 'traceId'],
                ['stepList', idx, 'entranceAppName'],
                ['stepList', idx, 'interfaceType'],
                ['stepList', idx, 'entranceInterfaceName'],
                ['stepList', idx, 'groupId'],
                ['stepList', idx, 'domainAppList'],
            ])
            // console.log('errRes', errRes);

            const stepList = form.getFieldValue('stepList');
            const newStepList = JSON.parse(JSON.stringify(stepList));
            setSearchTableLoading(true);
            setSearchIdx(idx);
            const params = stepList[idx];
            // console.log('paramsSearch',params);

            const res = await queryDomainLinkDetail({
                ...params,
                domainAppList: params?.domainAppList?.toString(),
            });

            if (res?.success) {
                newStepList[idx] = { ...newStepList[idx], tabData: res?.content?.result?.content };
                form.setFieldValue('stepList', newStepList);
                setTabData(newStepList);
                // setSearchTableLoading(false);
            } else {
                message.error({
                    content: res.errorMsg,
                    className: style.message
                });
                // setSearchTableLoading(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSearchTableLoading(false);
        }
    };
    // function getinfo(inf: any) {
    //   // 与Java插件交互的逻辑
    //   if (window?.cefQuery) {
    //     window?.cefQuery({
    //       // query 传json
    //       request: JSON.stringify(inf),
    //       onSuccess: function (response: any) {
    //         if (response) {
    //           return message;
    //         }
    //       },
    //       onFailure: function (error_code: any, error_message: string) {
    //         console.log('Error: ' + error_message);
    //       },
    //     });
    //   } else {
    //     // alert("CEF Query API not available");
    //   }
    // }

    const onFinish = async (values: any) => {
        console.log('values', values);
        try {
            const {
                parentDirectoryId,
                caseName,
                caseDesc,
                stepList,
                globalVarList,
                testFunctionPath,
                generateType: paramsGenerateType,
                // existTestClassContent,
                existTestClassPath,
                testFunctionName
            } = values;
            for (let idx = 0; idx < stepList?.length; idx++) {
                const item = stepList[idx];
                if (item?.tabData?.length < 1 || !item?.tabData) {
                    message.error({ content: `请先点击【查询】按钮，设置链路信息`, className: style.message });
                    return;
                }
            }
            const newGlobalVarList = globalVarList?.map((item: { atsConfig: any[] }) => {
                return {
                    ...item,
                    atsConfig: !!item?.atsConfig?.[0],
                };
            });

            const caseStepList = stepList?.map((item: any, idx: number) => {
                const tabKey = item?.tabKey ? Number(item?.tabKey) : 0;
                const {
                    stepDesc,
                    traceId,
                    domainAppList,
                    entranceAppName,
                    entranceInterfaceName,
                    // methodName,
                    interfaceType,
                    tabData: subTabData,
                    groupId,
                    withDbInfo,
                } = item || {};

                return {
                    stepIndex: idx,
                    stepDesc,
                    domainCaseQueryParam: {
                        traceId,
                        domainAppList: domainAppList?.toString(),
                        entranceAppName,
                        entranceInterfaceName,
                        // methodName,
                        // ...obj,
                        interfaceType,
                        groupId,
                        withDbInfo,
                    },

                    pickedDomainLinkDetails: {
                        content: {
                            entranceInterfaceInfo: subTabData?.[tabKey]?.entranceInterfaceInfo,
                            remoteMockInterfaceInfoList: subTabData?.[tabKey]?.remoteMockInterfaceInfoList,
                            outBoundCheckInterfaceInfoList: subTabData?.[tabKey]?.outBoundCheckInterfaceInfoList,
                            dbCheckInfoList: subTabData?.[tabKey]?.dbCheckInfoList,
                        },
                    },
                };
            });
            const baseParams: any = {
                parentDirectoryId,
                caseName,
                caseDesc,
                globalVarList: newGlobalVarList,
                caseStepList,
                testFunctionPath,
                // existTestClassContent,
                existTestClassPath,
                testFunctionName,
                generateType: paramsGenerateType
            };
            console.log('baseParams', baseParams);
            if (paramsGenerateType === 'insertIntoTestClass') {
                try {
                    console.log('websocketClient/domain_case/query_exist_test_file 已发送');
                    const fileRes = await websocketClient({
                        url: 'domain_case/query_exist_test_file',
                        data: {
                            filePath: existTestClassPath
                        }
                    })
                    console.log('已有测试类websocketRes', fileRes);
                    if (fileRes?.success) {
                        baseParams.existTestClassContent = fileRes?.data?.fileContent
                    }
                } catch (error) {
                    console.log('websocketClient/domain_case/query_exist_test_file err', error);

                }

            }

            if (type === 'edit') {
                baseParams.domainCaseId = editInfo?.node?.id;
            }

            setSubLoading(true);


            // console.log(!!urlInfoRef.current);
            console.log('pluginParams.get(pluginVersion)', pluginParams.get('pluginVersion'));
            // console.log('compareVersions((pluginParams.get(pluginVersion)), 2.0.5) ', compareVersions((pluginParams.get('pluginVersion')) as string, '2.0.5'));
            if (compareVersions((pluginParams.get('pluginVersion')) as string, '2.0.5') === 'old') {
                if (urlInfoRef.current) {
                    // getinfo({ operation: 'SUBMIT', Params: { ...baseParams } });
                    console.log('webscoket请求已发送');
                    websocketClient({ url: "domain_case/submit", data: baseParams }).then((res) => {
                        console.log('websocketClientRes', res);
                        if (res?.success) {
                            onSuccess?.(true);
                            onClose?.();
                        }
                    }).catch(err => {
                        console.log('err', err);
                    })
                    setSubLoading(false);
                } else {
                    const res = await createDomainCaseByPlugin(baseParams);
                    if (res?.success) {
                        setSubLoading(false);
                        onSuccess?.(true, res?.content);
                        onClose?.();
                        form.setFieldsValue({
                            caseName: '',
                            caseDesc: '',
                            stepList: [{}],
                            testFunctionPath:
                                type === 'add' ? currentDir : editInfo?.node?.domainCaseCreateParam?.testFunctionPath,
                        });
                        setTabData([]);
                    } else {
                        message.error({ content: res?.errorMsg, className: style.message });
                        setSubLoading(false);
                    }
                }
            }
            if (compareVersions((pluginParams.get('pluginVersion')) as string, '2.0.5') === 'new') {
                const res = await createDomainCaseByPlugin(baseParams);
                if (res?.success) {
                    console.log('websocketClient/domain_case/result_report 已发送');
                    websocketClient({
                        url: "domain_case/result_report",
                        data: {
                            success: res?.success,
                            answer: res?.content?.codeContentOssFile
                        }
                    }).then((wRes) => {
                        console.log('newWebsocketClientRes', wRes);
                        if (wRes?.success) {
                            onSuccess?.(true);
                            onClose?.();
                        }
                    }).catch(err => {
                        console.log('err', err);
                    })

                } else {
                    message.error({ content: res?.errorMsg, className: style.message });
                }
                setSubLoading(false);
            }

            // onClose?.();
        } catch (error) {
            console.log('onFinisherror', error);
        }
    };

    const onChange = (newValue: string) => {
        setValue(newValue);
    };

    const handleSelect = (value: React.SetStateAction<string>) => {
        setInputValue(value); // 将选中的值填入输入框
        setIsFocused(false);
    };

    const handleChange = (value: React.SetStateAction<string>) => {
        setLoaded(30);
        setInputValue(value); // 更新输入框的值
        setIsFocused(true);
        if (value) {
            setFilterData(
                selectData?.filter((option: any) => option?.value.toLowerCase().includes((value as any).toLowerCase())),
            );
        } else {
            setFilterData([]);
        }
    };

    const handleBlur = () => {
        // 隐藏下拉框
        setIsFocused(false);
    };

    const handleFocus = () => {
        // 显示下拉框
        setIsFocused(true);
    };

    useEffect(() => {
        if (open) {
            // getSelectionInfo();
            if (type === 'add') {
                setInputValue('');
                setOptions(selectData.slice(0, 30));
                setLoaded(30);
                setContent({});
                setInterfaceList({});
                setTabData([]);
                form.setFieldsValue({
                    caseName: '',
                    caseDesc: '',
                    stepList: [{}],
                    testFunctionPath: currentDir,
                });

            }
        }
    }, [open, isClick]);

    useEffect(() => {
        if (type === 'add') {
            form.setFieldsValue({
                testFunctionPath: currentDir,
            });
        }
    }, [currentDir]);

    /**编辑复制文档时 */
    useEffect(() => {
        if (open) {
            if (type === 'add') {
                form.setFieldsValue({
                    globalVarList: [
                        { names: ['env'], value: 'env', atsConfig: [true] },
                        { names: ['region'], value: 'region', atsConfig: [true] },
                        { names: ['routeGroup'], value: 'routeGroup', atsConfig: [true] },
                    ],
                    stepList: [
                        { stepDesc: 'Step 1', withDbInfo: false },
                    ],
                    generateType: 'newTestClass',
                    // existTestClassContent: '',
                    existTestClassPath: '',
                    testFunctionName: '',
                    testFunctionPath: props?.testFunctionPath || '',
                })
                setInputValue(props?.testFunctionPath || '')
                setGenerateType('newTestClass')
            }
            if (type === 'edit' || type === 'copy') {
                const info = editInfo?.node?.domainCaseCreateParam;
                console.log('info', info);

                const newGlobalVarList = info?.globalVarList?.map((item: { atsConfig: any }) => {
                    return {
                        ...item,
                        atsConfig: [item?.atsConfig],
                    };
                });
                const newStepList = info?.caseStepList?.map((item: any, idx: any) => {
                    const { stepDesc, domainCaseQueryParam, pickedDomainLinkDetails } = item;
                    const {
                        domainAppList,
                        entranceAppName,
                        entranceInterfaceName,
                        interfaceType,
                        traceId,
                        groupId,
                        withDbInfo,
                        // methodName,
                    } = domainCaseQueryParam;
                    // handleInputChange(idx, traceId, entranceAppName);

                    setInterfaceObj((preState: any) => ({ ...preState, [idx]: interfaceType }));
                    return {
                        stepDesc,
                        domainAppList: domainAppList?.split(','),
                        entranceAppName,
                        entranceInterfaceName,
                        interfaceType,
                        traceId,
                        groupId,
                        withDbInfo: withDbInfo ?? false,
                        // methodName,
                        tabData: [pickedDomainLinkDetails?.content],
                    };
                });
                form.setFieldsValue({
                    parentDirectoryId: info?.parentDirectoryId,
                    caseDesc: info?.caseDesc,
                    caseName: info?.caseName,

                    // existTestClassContent: info?.existTestClassContent,
                    existTestClassPath: info?.existTestClassPath,
                    testFunctionName: info?.testFunctionName,

                    generateType: info?.generateType ?? 'newTestClass',
                    stepList: newStepList,
                    editParentDirectoryId: editInfo?.node?.pathName,
                    globalVarList: newGlobalVarList,
                    testFunctionPath: info?.testFunctionPath,
                    // groupId: info?.groupId,
                });
                setGenerateType(info?.generateType ?? 'newTestClass')
                setTabData(newStepList);
            }
        }
    }, [type, editInfo, open, form]);

    useEffect(() => {
        if (type === 'add' || type === 'edit') {
            if (treeNode) {
                if (treeNode?.treeData) {
                    setTreeData(newTreeData(treeNode?.treeData));
                    form.setFieldValue('parentDirectoryId', null);
                    form.setFieldValue('idName', treeNode?.values);
                } else {
                    form.setFieldValue('parentDirectoryId', treeNode?.id);
                    setTreeData(null);
                }
            }
        }
        if (type === 'copy') {
            if (treeNode?.treeData) {
                setTreeData(newTreeData(treeNode?.treeData));
                form.setFieldValue('parentDirectoryId', treeNode?.id);
                form.setFieldValue('idName', treeNode?.values);
            }
        }
    }, [treeNode, type, form]);

    useEffect(() => {
        if (inputValue) {
            setOptions(filterData.slice(0, loaded));
        } else {
            setOptions(selectData.slice(0, loaded));
        }
    }, [loaded, inputValue, filterData, selectData]);

    useEffect(() => {
        if (open) {
            console.log('websocketClient/domain_case/query_dirs 已发送');

            websocketClient({
                url: 'domain_case/query_dirs',
                data: {
                    generateType: generateType
                }
            }).then((res) => {
                console.log('websocketRes', res);
                if (res?.success) {
                    if (res?.data?.dirs?.length > 0) {
                        const newSelectData = res?.data?.dirs?.map((item: any) => ({
                            label: item,
                            value: item,
                        }));
                        setSelectData(newSelectData);
                        // setInputValue(props?.testFunctionPath || '')
                    }
                }
            }).catch(err => {
                console.log('websocketErr', err);
            })
        }

    }, [generateType, open])

    const setCaseNameLabel = () => {
        if (urlInfoRef.current && generateType === 'insertIntoTestClass') {
            return '用例方法名'
        }
        if (urlInfoRef.current) {
            return '用例类名'
        }
        return '用例名称'
    }

    const setEntranceInterfaceNameConfig = (idx: string | number) => {
        // console.log('interfaceList',interfaceList);

        let result = { label: '接口名', options: [] }
        if (interfaceObj[idx] === 'MSG') {
            result = {
                label: 'Topic.EventCode',
                options: interfaceList[idx]?.msgServiceList?.map((item: any) => ({
                    label: item?.service,
                    value: item?.service,
                }))
            }
        }

        if (interfaceObj[idx] === 'RPC') {
            result = {
                label: '服务名称.方法名',
                options: interfaceList[idx]?.rpcServiceList?.map((item: any) => ({
                    label: item,
                    value: item,
                }))
            }
        }

        if (interfaceObj[idx] === 'HTTP') {
            result = {
                label: '接口名',
                options: interfaceList[idx]?.httpServiceList?.map((item: any) => ({
                    label: item,
                    value: item,
                }))
            }
        }
        // console.log('result', result);

        return result
    }

    return (
        <>
            <div >
                <Drawer
                    title={`${type === 'add' ? '新增' : type === 'edit' ? '编辑' : '复制'}资产`}
                    width={`90vw`}
                    destroyOnClose={true}
                    onClose={() => {
                        onCanael();
                    }}
                    className={urlInfoRef.current ? style.drawer : null}
                    open={open}
                    bodyStyle={{ paddingBottom: 80 }}
                    extra={
                        <Space>
                            <Button onClick={() => onCanael()}>取消</Button>
                            <Button
                                onClick={() => {
                                    form.submit()
                                }}
                                type="primary"
                                loading={subLoading}>
                                生成
                            </Button>
                        </Space>
                    }
                >
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        initialValues={{ stepList: [{}] }}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    // label=' '
                                    name='generateType'
                                    rules={[{ required: true }]}
                                >
                                    <Radio.Group
                                        onChange={e => {
                                            const key = e.target.value
                                            setGenerateType(key)
                                        }}
                                    >
                                        <Radio value="newTestClass">
                                            <CustomToolTip
                                                value='生成新的测试类'
                                                info='创建新的测试类，其中包含可执行的测试方法'
                                            />
                                        </Radio>
                                        <Radio value="insertIntoTestClass">
                                            <CustomToolTip
                                                value='在既有测试类中添加'
                                                info='在既有的测试类中添加新的测试方法'
                                            />
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                {type === 'add' && (
                                    <>
                                        {treeData ? (
                                            <>
                                                <Form.Item name="parentDirectoryId" noStyle />
                                                <Form.Item
                                                    name="idName"
                                                    label="归属目录"
                                                    rules={[{ required: true, message: '请选择' }]}
                                                >
                                                    <TreeSelect
                                                        showSearch
                                                        style={{ width: '100%' }}
                                                        value={value}
                                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto', filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                        placeholder="搜索选择"
                                                        allowClear
                                                        onChange={onChange}
                                                        treeData={treeData}
                                                        onSelect={(_val, node) => {
                                                            form.setFieldValue('parentDirectoryId', node?.id);
                                                            form.setFieldValue('idName', node?.pathName);
                                                        }}
                                                        filterTreeNode={(val: any, newTreeNode: any) =>
                                                            newTreeNode.title.toLowerCase().includes(val.toLowerCase())
                                                        }
                                                    />
                                                </Form.Item>
                                            </>
                                        ) : (
                                            <Form.Item
                                                name="parentDirectoryId"
                                                label="归属目录"
                                                rules={[{ required: true }]}
                                            >
                                                <Select disabled dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}>
                                                    <Select.Option key={'treeNode'} value={treeNode?.id}>
                                                        {treeNode?.pathName}
                                                    </Select.Option>
                                                </Select>
                                            </Form.Item>
                                        )}
                                    </>
                                )}
                                {type === 'edit' && (
                                    <>
                                        <Form.Item name="parentDirectoryId" noStyle />
                                        <Form.Item
                                            name="editParentDirectoryId"
                                            label="归属目录"
                                            rules={[{ required: true }]}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                    </>
                                )}
                                {type === 'copy' && (
                                    <>
                                        <Form.Item name="parentDirectoryId" noStyle />
                                        <Form.Item
                                            name="idName"
                                            label="归属目录"
                                            rules={[{ required: true, message: '请选择' }]}
                                        >
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                // value={value}
                                                // defaultValue={'23000012'}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                placeholder="搜索选择"
                                                allowClear
                                                onChange={onChange}
                                                treeData={treeData}
                                                onSelect={(_val, node) => {
                                                    form.setFieldValue('parentDirectoryId', node?.id);
                                                    form.setFieldValue('idName', node?.pathName);
                                                }}
                                            />
                                        </Form.Item>
                                    </>
                                )}
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    // name="caseName"
                                    name={generateType === 'insertIntoTestClass' ? 'testFunctionName' : 'caseName'}
                                    // label={urlInfoRef.current ? '用例类名'}
                                    label={setCaseNameLabel()}
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="如PayTest" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="caseDesc"
                                    label="用例描述"
                                // rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>

                        {urlInfoRef.current && (
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        // name="testFunctionPath"
                                        name={generateType === 'insertIntoTestClass' ? 'existTestClassPath' : "testFunctionPath"}
                                        label={generateType === 'insertIntoTestClass' ? '既有测试类文件路径' : "测试用例路径"}
                                        rules={[{ required: true, message: '请输入' }]}
                                    >
                                        <AutoComplete
                                            placeholder='请输入'
                                            value={inputValue}
                                            open={isFocused}
                                            options={options}
                                            dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                            onSelect={handleSelect}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            virtual={false}
                                            onFocus={handleFocus}
                                            defaultActiveFirstOption={false}
                                            onPopupScroll={(event) => {
                                                const { scrollTop, clientHeight, scrollHeight, clientTop } =
                                                    event.currentTarget;
                                                if (clientTop + scrollTop + clientHeight === scrollHeight) {
                                                    setLoaded((prevLoaded) => prevLoaded + 30);
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        <Card
                            title={
                                <>
                                    <span>全局变量</span>
                                    <span style={{ color: 'red' }}>
                                        （在用例运行时，全局变量会将request、response中name相同字段进行自动替换）
                                    </span>
                                </>
                            }
                            size="small"
                        >
                            <Form.List name="globalVarList">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => {
                                            return (
                                                <div style={{ display: 'flex' }} key={key} className={style.formList}>
                                                    <Row
                                                        key={key}
                                                        gutter={[6, 6]}
                                                        className={style.formList}
                                                        wrap={false}
                                                        justify="space-between"
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Col span={11}>
                                                            <Form.Item
                                                                {...restField}
                                                                label={key === 0 ? 'name' : false}
                                                                name={[name, 'names']}
                                                                rules={[{ required: true, message: '请输入' }]}
                                                            >
                                                                <Select
                                                                    mode="tags"
                                                                    dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                                    style={{ width: '100%' }}
                                                                    tokenSeparators={[',']}
                                                                    options={[]}
                                                                    placeholder="请输入"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={0.5}>
                                                            <div
                                                                style={{
                                                                    fontSize: 22,
                                                                    marginTop: key === 0 ? '25px' : '-4px',
                                                                    // marginLeft: '45%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                =
                                                            </div>
                                                        </Col>
                                                        <Col span={11}>
                                                            <Form.Item
                                                                {...restField}
                                                                label={key === 0 ? 'value' : false}
                                                                name={[name, 'value']}
                                                                rules={[{ required: true, message: '请输入' }]}
                                                            >
                                                                <Input placeholder="请输入" />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginLeft: 10,
                                                            width: 170,
                                                        }}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label={false}
                                                            name={[name, 'atsConfig']}
                                                            rules={[{ required: false, message: '请输入' }]}
                                                        >
                                                            <Checkbox.Group
                                                                style={{
                                                                    marginTop: key === 0 ? '33px' : '1px',
                                                                }}
                                                            >
                                                                <Checkbox value={true}>
                                                                    <div style={{ whiteSpace: 'nowrap' }}>ats-config配置</div>
                                                                </Checkbox>
                                                            </Checkbox.Group>
                                                        </Form.Item>
                                                        <a
                                                            style={{ marginLeft: 3, marginTop: key === 0 ? '28px' : '-2px' }}
                                                            onClick={() => remove(name)}
                                                        >
                                                            <div style={{ whiteSpace: 'nowrap' }}>删除</div>
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                style={{ marginTop: 10 }}
                                                onClick={() => {
                                                    add();
                                                }}
                                                block
                                            >
                                                添加
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                        <Divider />
                        {/* 核心1:方案选择Form.List */}
                        <Form.List name="stepList">
                            {(fields, { add, remove }) => (
                                <>
                                    <Collapse
                                        activeKey={activeKey}
                                        expandIcon={({ isActive }) => <DoubleRightOutlined rotate={isActive ? 90 : 0} />}
                                        onChange={(key) => {
                                            setActiveKey(key);
                                        }}
                                    //   ghost
                                    >
                                        {fields.map(({ key, name, ...restField }) => {
                                            return (
                                                <Panel
                                                    header={
                                                        <div style={{ color: '#5c77f4', fontWeight: 800 }}>
                                                            {`Step ${name + 1}`}
                                                            <span
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <Popconfirm
                                                                    title={`确认删除此条 Step？`}
                                                                    overlayClassName={urlInfoRef.current ? style.popover : null}
                                                                    onConfirm={() => {
                                                                        remove(name);
                                                                        const stepList = form.getFieldValue('stepList');
                                                                        delete content[name];
                                                                        delete interfaceList[name];

                                                                        const newObj: any = {};
                                                                        let newIndex = 0;
                                                                        for (const index in content) {
                                                                            newObj[newIndex] = content[index];
                                                                            newIndex++;
                                                                        }

                                                                        setContent(newObj);

                                                                        const newObj2: any = {};
                                                                        let newIndex2 = 0;
                                                                        for (const index in interfaceList) {
                                                                            newObj2[newIndex2] = interfaceList[index];
                                                                            newIndex2++;
                                                                        }
                                                                        setInterfaceList(newObj2);

                                                                        setTabData(stepList);
                                                                    }}
                                                                    okText="确认"
                                                                    cancelText="取消"
                                                                >
                                                                    <CloseCircleOutlined style={{ marginLeft: 20, color: '#1683ff' }} />
                                                                </Popconfirm>
                                                            </span>
                                                        </div>
                                                    }
                                                    key={String(name)}
                                                >
                                                    <Row gutter={16}>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                label="描述"
                                                                name={[name, 'stepDesc']}
                                                                initialValue={`Step ${name + 1}`}
                                                            // rules={[{ required: true, message: '请输入' }]}
                                                            >
                                                                <Input placeholder="请输入" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                label="traceId"
                                                                name={[name, 'traceId']}
                                                                rules={[{ required: true, message: '请输入' }]}
                                                            >
                                                                <Input
                                                                    placeholder="支持dev/sim环境的traceId"
                                                                    onChange={(e) => {

                                                                        if (e.target.value) {
                                                                            handleInputChange(name, e.target.value);
                                                                        }
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                label="入口应用名"
                                                                name={[name, 'entranceAppName']}
                                                                rules={[{ required: true, message: '请输入' }]}
                                                            >
                                                                <Select
                                                                    loading={loading}
                                                                    showSearch
                                                                    dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none', }}
                                                                    disabled={
                                                                        content[name]
                                                                            ? Object.keys(content[name])?.length !== 0
                                                                                ? false
                                                                                : true
                                                                            : true
                                                                    }
                                                                    // filterOption={false}
                                                                    onSelect={(value) => {
                                                                        if (value) {
                                                                            const stepList = form.getFieldValue('stepList');
                                                                            const newStepList = JSON.parse(JSON.stringify(stepList));
                                                                            newStepList[name] = {
                                                                                ...newStepList[name],
                                                                                domainAppList: [value],
                                                                                entranceInterfaceName: undefined,
                                                                            };
                                                                            form.setFieldValue('stepList', newStepList);

                                                                        }

                                                                        setInterfaceList({
                                                                            ...interfaceList,
                                                                            [name]: content[name][value],
                                                                        });
                                                                    }}
                                                                    placeholder={'请选择'}
                                                                    options={
                                                                        content[name]
                                                                            ? Object.keys(content[name])?.map((item) => ({
                                                                                label: item,
                                                                                value: item,
                                                                            }))
                                                                            : []
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                label="接口类型"
                                                                name={[name, 'interfaceType']}
                                                                // initialValue={'RPC'}
                                                                rules={[{ required: true, message: '请输入' }]}
                                                            >
                                                                <Select
                                                                    // defaultValue='RPC'
                                                                    dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                                    placeholder="请选择"
                                                                    onSelect={(key) => {
                                                                        setInterfaceObj({
                                                                            ...interfaceObj,
                                                                            [name]: key,
                                                                        });
                                                                    }}
                                                                >
                                                                    <Select.Option key={'RPC'} value={'RPC'}>
                                                                        RPC
                                                                    </Select.Option>
                                                                    <Select.Option key={'MSG'} value={'MSG'}>
                                                                        MSG
                                                                    </Select.Option>
                                                                    <Select.Option key={'HTTP'} value={'HTTP'}>
                                                                        HTTP
                                                                    </Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={16}>
                                                            <Form.Item
                                                                {...restField}
                                                                label={setEntranceInterfaceNameConfig(name)?.label}
                                                                name={[name, 'entranceInterfaceName']}
                                                                rules={[{ required: true, message: '请选择' }]}
                                                            >
                                                                <Select
                                                                    loading={loading}
                                                                    showSearch
                                                                    dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                                    disabled={interfaceList[name] ? false : true}
                                                                    // filterOption={false}
                                                                    onSelect={(val) => {
                                                                        if (interfaceObj[name] === 'MSG') {
                                                                            setTopicEventCode(val)
                                                                        }
                                                                    }}
                                                                    options={setEntranceInterfaceNameConfig(name)?.options}
                                                                    placeholder={'请选择'}
                                                                />
                                                            </Form.Item>

                                                        </Col>
                                                        {interfaceObj[name] === 'MSG' ? (
                                                            <Col span={8}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    label="订阅端 groupId"
                                                                    name={[name, 'groupId']}
                                                                    rules={[{ required: true, message: '请输入' }]}
                                                                >
                                                                    <AutoComplete
                                                                        placeholder='请输入'
                                                                        value={groupIdValue}
                                                                        // open={isFocused}
                                                                        // disabled={!topicEventCode}
                                                                        options={
                                                                            [{
                                                                                label: interfaceList[name]?.msgServiceList?.find((item: Record<string, any>) => item?.service === topicEventCode)?.groupId,
                                                                                value: interfaceList[name]?.msgServiceList?.find((item: Record<string, any>) => item?.service === topicEventCode)?.groupId
                                                                            }]
                                                                        }
                                                                        dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                                        onChange={(value) => {
                                                                            setGroupIdValue(value)
                                                                        }}
                                                                        defaultActiveFirstOption={false}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        ) : (
                                                            ''
                                                        )}

                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                label={
                                                                    <>
                                                                        <span style={{ marginRight: 3 }}>域应用列表</span>
                                                                        <Tooltip title="域内应用真实执行，域外应用mock">
                                                                            <QuestionCircleOutlined />
                                                                        </Tooltip>
                                                                    </>
                                                                }
                                                                name={[name, 'domainAppList']}
                                                                rules={[{ required: true, message: '请选择' }]}
                                                            >
                                                                <Select
                                                                    loading={loading}
                                                                    mode="multiple"
                                                                    showSearch
                                                                    dropdownStyle={{ filter: 'invert(0.85) hue-rotate(170deg)', boxShadow: 'none' }}
                                                                    disabled={
                                                                        content[name]
                                                                            ? Object.keys(content[name])?.length !== 0
                                                                                ? false
                                                                                : true
                                                                            : true
                                                                    }
                                                                    options={
                                                                        content[name]
                                                                            ? Object.keys(content[name])?.map((item) => ({
                                                                                label: item,
                                                                                value: item,
                                                                            }))
                                                                            : []
                                                                    }
                                                                    placeholder={'请选择'}
                                                                />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                label={
                                                                    <>
                                                                        <span style={{ marginRight: 3 }}>是否查询关联DB数据</span>
                                                                        <Tooltip title="选择查询关联DB数据会增加查询耗时">
                                                                            <QuestionCircleOutlined />
                                                                        </Tooltip>
                                                                    </>
                                                                }
                                                                name={[name, 'withDbInfo']}
                                                                rules={[{ required: true, message: '请选择' }]}
                                                                initialValue={false}
                                                            >
                                                                <Radio.Group>
                                                                    <Radio value={true}>是</Radio>
                                                                    <Radio value={false}>否</Radio>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </Col>



                                                        <Form.Item name={[name, 'tabData']} noStyle />
                                                        <Form.Item name={[name, 'tabKey']} noStyle />
                                                        {/* <Col span={interfaceObj[name] === 'MSG' ? 8 : 16}  > */}
                                                        <Col span={24}  >
                                                            <Button
                                                                type="primary"
                                                                style={{ float: 'right', marginRight: '8px', marginTop: -15 }}
                                                                loading={name === searchIdx && searchTableLoading}
                                                                onClick={() => onSearchTabData(name)}
                                                            >
                                                                查询
                                                            </Button>
                                                        </Col>
                                                        <Col span={24}>
                                                            {/* 核心2:数据传递及更新*/}
                                                            {tabData[name] && (
                                                                <DrawerTab
                                                                    data={tabData[name]}
                                                                    idx={name}
                                                                    interfaceObj={interfaceObj[name]}
                                                                    searchIdx={searchIdx}
                                                                    loading={searchTableLoading}
                                                                    fatherForm={form}
                                                                    onChange={(vals: Record<string, string>) => {
                                                                        if (vals) {
                                                                            const stepList = form.getFieldValue('stepList');
                                                                            stepList[name] = {
                                                                                ...stepList[name],
                                                                                tabData: vals?.tabData,
                                                                                tabKey: vals?.tabKey,
                                                                            };
                                                                            form.setFieldValue('stepList', stepList);
                                                                            setTabData(stepList)
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Panel>
                                            );
                                        })}
                                    </Collapse>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            style={{ marginTop: 10 }}
                                            onClick={() => {
                                                add();
                                                setActiveKey([String(fields.length)]);
                                            }}
                                            block
                                        >
                                            添加 Step
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </Drawer>
            </div>
        </>
    );
};

export default AddDrawer;