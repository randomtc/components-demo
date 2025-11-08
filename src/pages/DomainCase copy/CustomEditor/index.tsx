import ConfigSpecialVerif from './ConfigSpecialVerif';
import EditValue from './EditValue';
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, Tree } from 'antd';
/* eslint-disable react-hooks/exhaustive-deps */
import {
    findAllAssertKeys,
    modifySubData,
    deepConvertEmptyArraysToString,
    convertFromJsonPath,
    convertToDesiredFormat,
} from '../utils';
interface CustomEditorType {
    ConvertToAntdTreeDataFunction: (data: any, nodeKey?: string, depth?: number) => any;
    BuildTreeNode: (el: object, key: any, isBasicType?: boolean) => void;
}
interface IProps {
    data: any;
    rootNode: string;
    showAssertChecked?: boolean;
    showEditValue?: boolean;
    isAllAssert?: boolean;
    isAllCheckbox?: boolean;
    onChange: (...set: any) => void;
    showNode?: any;
    noShowAssert?: boolean;
    showConfigSpecialVerif?: boolean
}
/**
 * @param showAssertChecked       是否展示Assert框（默认不展示）
 * @param showEditValue           是否展示编辑框（默认不展示）
 * @param isAllAssert             是否展示全选（默认不展示）
 * @param showConfigSpecialVerif  是否展示特殊校验规则（默认不展示）
 * @param isAllCheckbox           是否全选（默认不全选）
 * @param noShowAssert            是否展示assert文字（默认展示）
 * @param showNode                指定节点的value值作为数据源
 * @returns
 */


const CustomEditor = (props: IProps) => {
    const {
        data: propsData,
        rootNode,
        showAssertChecked = false,
        showEditValue = false,
        isAllAssert = false,
        isAllCheckbox = false,
        onChange,
        noShowAssert,
        showConfigSpecialVerif = false,
    } = props;
    // console.log("🚀 ~ CustomEditor ~ propsData:", propsData)
    const [editorData, setEditorData] = useState(propsData);
    const [renderData, setRenderData] = useState<any>();
    const [assertKeys, setAssertKeys] = useState<string[]>([]);
    const [allCheckedKeys, setAllCheckedKeys] = useState<any>([]);

    useEffect(() => {
        // console.log('CustomEditorsubData', editorData);
        onChange(editorData);
    }, [editorData]);

    const [isFirstRender, setIsFirstRender] = useState(true)
    useEffect(() => {
        //初始化
        if (propsData) {
            const newRenderData = deepConvertEmptyArraysToString(propsData)
            setRenderData(newRenderData);
            if (isFirstRender) {
                const newAssertKeys = convertFromJsonPath((propsData[rootNode]?.['assertKeys']), rootNode)
                setAssertKeys(newAssertKeys);//回显勾选项
                setAllCheckedKeys(findAllAssertKeys(newRenderData));
                if (isAllCheckbox) {
                    selectAll(true, newRenderData)
                }

            }
            setIsFirstRender(false)
        }
    }, [propsData]);


    const updateEditorData = (newData: any, patch: string, val: string | string[]) => {
        const newSubData = modifySubData(newData, patch, val);
        setEditorData(newSubData);
    };

    /**编辑节点时候更新数据 */
    const onEdit = (key: string, val: string) => {
        updateEditorData(editorData, key, val);
    };

    /**勾选项 */
    const onCheckbox = (isChecked: boolean, selectTreeKey: string) => {
        let newAssertKeys = [...assertKeys];
        if (isChecked) {
            newAssertKeys.push(selectTreeKey);
        } else {
            newAssertKeys = newAssertKeys.filter((item) => item !== selectTreeKey);
        }
        setAssertKeys(newAssertKeys);
    };

    /**给数据根节点（rootNode）添加assertKeys项 */
    const addAssertKeys = (keys: string[]) => {
        if (keys.length > 0) {
            updateEditorData(editorData, `${rootNode}.assertKeys`, convertToDesiredFormat(keys));
        } else {
            updateEditorData(editorData, `${rootNode}.assertKeys`, []);
        }
    };

    /**全选Assert */
    const selectAll = (check: boolean, data?: any) => {
        console.log("🚀 ~ selectAll ~ check:", check)
        if (check) {
            const keys = findAllAssertKeys(data || renderData);
            setAssertKeys(keys as string[]);
        } else {
            setAssertKeys([]);
        }
    };



    useEffect(() => {
        console.log('assertKeys', assertKeys);
        if (showAssertChecked) {
            addAssertKeys(assertKeys);
        }

    }, [assertKeys]);


    /**配置特殊校验
     * 不与原逻辑耦合（只需修改此块）
     * （代码健壮性预留拓展）
     * Map 的特性：
     * Map 是一种键值对数据结构，它的键是唯一的。
     * 如果多次使用相同的键（item.keyPath）调用 Map.set()，后一次的值会覆盖前一次的值。
     */
    const handleSpecialConfig = (vals: any) => {
        const specialAssertConfigs = editorData?.[rootNode]?.specialAssertConfigs ?? []

        //根据keyPath去重，保留最新项 
        const resultMap = new Map();
        [...specialAssertConfigs, vals].forEach((item) => {
            resultMap.set(item.keyPath, item);
        });
        const uniqueArray = Array.from(resultMap.values());

        const newSubData = modifySubData(editorData, `${rootNode}.specialAssertConfigs`, uniqueArray);
        setEditorData(newSubData);
    }

    /**数据转为tree组件数据格式 */
    const convertToAntdTreeData: CustomEditorType['ConvertToAntdTreeDataFunction'] = (
        data,
        nodeKey = 'root',
        depth = 0,
    ) => {
        // 构建树节点
        const buildTreeNode: CustomEditorType['BuildTreeNode'] = (el, key, isBasicType = false) => {
            // 更新节点key为链式结构
            const itemKey = depth === 0 ? `${key}` : `${nodeKey}.${key}`;
            /**
             * 子节点为基本数据类型并且是子节点才支持勾选编辑
             */
            const title = isBasicType ? (
                // isBasicType && itemKey.includes('yamlData') ? (
                <div style={{ display: 'flex' }}>
                    <span>{key}：</span>
                    <span>
                        {showEditValue ? (
                            <EditValue value={String(el)} onEdit={(val) => onEdit(itemKey, val)} />
                        ) : (
                            String(el)
                        )}
                    </span>

                    {/* 配置特殊校验 */}
                    <span style={{ display: showConfigSpecialVerif ? '' : 'none', marginLeft: 5 }}>
                        <ConfigSpecialVerif
                            keyPath={convertToDesiredFormat([itemKey])?.[0]}
                            value={String(el)}
                            specialAssertConfigs={editorData?.[rootNode]?.specialAssertConfigs ?? []}
                            onConfirm={(vals: any) => {
                                handleSpecialConfig(vals)
                            }}
                        />
                    </span>

                    <span style={{ marginLeft: 5, display: showAssertChecked ? '' : 'none' }}>
                        <Checkbox
                            checked={assertKeys?.includes(itemKey)}
                            onChange={(e) => {
                                onCheckbox(e.target.checked, itemKey)
                            }}
                        >
                            <span style={{ color: 'red' }}>{noShowAssert ? '' : 'Assert'}</span>
                        </Checkbox>

                    </span>
                </div>
            ) : (
                <div>
                    <span>{key}</span>

                    <span
                        style={{
                            marginLeft: 15,
                            display: ['editData'].includes(itemKey) && isAllAssert && showAssertChecked ? '' : 'none',
                        }}
                    >
                        <Checkbox
                            style={{ visibility: isAllAssert ? 'visibility' : 'hidden' as any }}
                            checked={allCheckedKeys?.length === assertKeys?.length}
                            indeterminate={0 < assertKeys?.length && assertKeys?.length < allCheckedKeys?.length}
                            onChange={(e) => selectAll(e.target.checked)}
                        >
                            <span>全选</span>
                        </Checkbox>
                    </span>
                </div>
            );
            return {
                key: itemKey,
                title: title,
                children: isBasicType ? null : convertToAntdTreeData(el, itemKey, depth + 1), // 基本数据类型没有子节点
            };
        };

        if (Array.isArray(data) && data?.length > 0) {
            // 处理数组类型的数据
            return data.map((el, index) => {
                const key = index; // 数组的 key 为它的索引
                if (typeof el === 'object') {
                    return buildTreeNode(el, key);
                } else {
                    return buildTreeNode(el, key, true); // 基本数据类型直接显示值
                }
            });
        } else if (data !== null && typeof data === 'object') {
            // 处理对象类型的数据
            return Object.keys(data).map((key) => {
                const el = data[key];
                const isBasicType = !(el !== null && typeof el === 'object');
                return buildTreeNode(el, key, isBasicType);
            });
        } else {
            // 处理根节点为基本数据类型的情况
            return [
                {
                    key: nodeKey,
                    title: `${nodeKey}: ${data}`,
                },
            ];
        }
    };
    const treeData = useMemo(() => convertToAntdTreeData(renderData), [renderData]);

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            {renderData && (
                <Tree
                    defaultExpandedKeys={allCheckedKeys}
                    treeData={treeData}
                    virtual
                />
            )}

        </div>
    );
};

export default CustomEditor;