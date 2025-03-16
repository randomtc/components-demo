/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Tree, Checkbox } from 'antd';
import EditValue from './EditValue';
import {
  findAllAssertKeys,
  modifySubData,
  convertYamlDatapropertiesToObject,
  deepConvertEmptyArraysToString,
} from '../utils';
import ConfigSpecialVerif from './ConfigSpecialVerif';
interface CustomEditorType {
  ConvertToAntdTreeDataFunction: (data: any, nodeKey?: string, depth?: number) => any;
  BuildTreeNode: (el: object, key: any, isBasicType?: boolean) => void;
}
interface IProps {
  data: any;
  rootNode: string;
  assertChecked?: boolean;
  editValue?: boolean;
  isAllAssert?: boolean;
  interfaceObj?: string;
  onChange: (...set: any) => void;
  showNode?: any;
  noShowAssert?: boolean;
  selectKey?: string
  selectKeyRootNode?: string
  noShowConfigSpecialVerif?: boolean
}
/**
 * @param assertChecked     是否展示Assert框（默认不展示）
 * @param editValue         是否展示编辑框（默认不展示）
 * @param interfaceObj      根据interfaceOb处理
 * @param showNode          指定节点的value值作为数据源
 * @param noShowAssert      是否展示assert文字（默认展示）
 * @param selectKey         储存选择节点的key
 * @param selectKeyRootNode 节点key值的前缀值
 * @returns
 */

const jsonToObjArr = ['yamlData', 'properties', 'sofaContext', 'eventPayload', 'headers', 'realYamlData']

const CustomEditor = (props: IProps) => {
  const {
    data: propsData,
    rootNode,
    assertChecked = false,
    editValue = false,
    isAllAssert = false,
    onChange,
    interfaceObj,
    showNode,
    noShowAssert,
    noShowConfigSpecialVerif = false,
    selectKey,
    selectKeyRootNode
  } = props;
  const [subData, setSubData] = useState(
    convertYamlDatapropertiesToObject(propsData, rootNode, jsonToObjArr)
  );

  const [renderData, setRenderData] = useState<any>();
  // const [subData, setSubData] = useState(testData);
  const [assertKeys, setAssertKeys] = useState<string[]>([]);
  const [allAssert, setAllAssert] = useState<any>( []);

  useEffect(() => {
    // console.log('CustomEditorsubData', subData);
    onChange(subData);
  }, [subData]);

  /**将链式转为JSONPath（$[0].parameter.order）结构 */
  const convertToDesiredFormat = (arr: string[]) => {
    return arr.map((item) => {
      // 删除第一个点（.）之前的内容
      const modifiedItem = item.replace(/^[^\.]+/, '');
      //将数字以及前边的点（.0）替换为（[0]）
      const modified = modifiedItem.replace(/\.(\d+)/g, '[$1]');
      // 在字符串开始处添加 '$'
      // return `$${modified}`;
      return `$${modified}`;
    });
  };

  /**JSONPath（$[0].parameter.order）转为链式结构 */
  const convertFromJsonPath = (arr: string[]) => {
    if (!arr) return [];
    return arr.map((item) => {
      // 去掉开头的 '$'
      let modifiedItem = item.replace(/^\$/, '');
      // 将 '[数字]' 替换为 '.数字'
      modifiedItem = modifiedItem.replace(/\[(\d+)\]/g, '.$1');
      // 如果开头是 '.' 或者 '', 去掉它
      if (modifiedItem.startsWith('.')) {
        modifiedItem = modifiedItem.slice(1);
      }
      return `${selectKeyRootNode ?? rootNode}.${modifiedItem}`;
    });
  };

  const [isFirstRender, setIsFirstRender] = useState(true)
  useEffect(() => {
    //初始化
    if (propsData) {
      const newPropsData = convertYamlDatapropertiesToObject(propsData, rootNode, jsonToObjArr)
      if (isFirstRender) {
        setAssertKeys(convertFromJsonPath(newPropsData[rootNode]?.[selectKey || 'assertKeys']));//回显勾选项
      }
      newPropsData.rootNode = newPropsData;
      const editData = newPropsData?.[rootNode]?.yamlData;
      const properties = newPropsData?.[rootNode]?.properties;
      const sofaContext = newPropsData?.[rootNode]?.sofaContext;
      const eventPayload = newPropsData?.[rootNode]?.eventPayload;
      const headers = newPropsData?.[rootNode]?.headers;
      const realYamlData = newPropsData?.[rootNode]?.realYamlData;

      const msgRenderDataObj: any = {
        yamlData: editData,
        properties,
        sofaContext,
        eventPayload,
      }
      const rpcRenderDataObj: any = {
        yamlData: editData,
        sofaContext,
      }
      const httpRenderDataObj: any = {
        yamlData: editData,
        headers,
      }

      const msgRenderData = { [showNode]: msgRenderDataObj[showNode] }
      const rpcRenderData = { [showNode]: rpcRenderDataObj[showNode] }
      const httpRenderData = { [showNode]: httpRenderDataObj[showNode] }

      const setNewRenderData = () => {
        const defaultShowData = { [rootNode]: editData || {} }
        let result = defaultShowData     //兼容最初版本（最初版本无interfaceObj属性）
        if (showNode === 'realYamlData') {
          result = { [rootNode]: realYamlData || {} }
        }

        if (interfaceObj === 'MSG') {
          result = msgRenderData
        }

        if (interfaceObj === 'RPC') {
          result = showNode ? rpcRenderData : defaultShowData
        }

        if (interfaceObj === 'HTTP') {
          result = showNode ? httpRenderData : defaultShowData
        }
        return result
      }
      setRenderData(deepConvertEmptyArraysToString(setNewRenderData()));
      if (isFirstRender) {
        setAllAssert(findAllAssertKeys(deepConvertEmptyArraysToString(setNewRenderData())));
      }
      setIsFirstRender(false)
    }
  }, [propsData]);


  const updataSubData = (newData: any, patch: string, val: string | string[]) => {
    //原数据更新时候添加yamlData项（和不显示yamlData配合使用）
    const arr = patch.split('.') || [];

    if (interfaceObj === 'MSG') {
      if (arr[1] !== 'assertKeys') {//初始化assertKeys赋值不需要插入隐藏key
        if (showNode === 'realYamlData') {
          arr.splice(1, 0, 'realYamlData');
        } else {
          arr.unshift('request')
        }
      }
    }

    if (interfaceObj !== 'MSG') {
      if (arr[1] !== 'assertKeys') {
        if (showNode) {
          if (showNode === 'realYamlData') {
            arr.splice(1, 0, 'realYamlData');
          } else {
            arr.unshift('request')
          }
        } else {
          arr.splice(1, 0, 'yamlData');
        }
      }
    }

    const newPatch = arr?.join('.');

    const newSubData = modifySubData(newData, newPatch, val);
    setSubData(newSubData);
  };

  /**编辑节点时候更新数据 */
  const onEdit = (key: string, val: string) => {
    updataSubData(subData, key, val);
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
      updataSubData(subData, `${rootNode}.assertKeys`, convertToDesiredFormat(keys));
    } else {
      updataSubData(subData, `${rootNode}.assertKeys`, []);
    }
  };

  /**全选Assert */
  const selectAll = (check: boolean) => {
    if (check) {
      const keys = findAllAssertKeys(renderData);
      setAssertKeys(keys as string[]);
    } else {
      setAssertKeys([]);
    }
  };

  const [isAll, setIsAll] = useState(true)
  const [oneTimeSwitch, setOneTimeSwitch] = useState(true)
  useEffect(() => {
    if (rootNode === 'response' && renderData) {
      if (assertKeys?.length === 0) {
        // if (propsData?.response?.assertKeys?.length === 0) {
        if (isAll && oneTimeSwitch) {
          selectAll(true)
          setIsAll(false)
          setOneTimeSwitch(false)
        }
      }
    }
  }, [rootNode, renderData]);

  useEffect(() => {
    // console.log('assertKeys', assertKeys);
    if (assertChecked) {
      addAssertKeys(assertKeys);
    }

  }, [assertKeys]);


  /**配置特殊校验
   * 不与原逻辑耦合（只需修改此块）
   */
  const onConfigSpecialVerif = (vals: any) => {
    const specialAssertConfigs = subData?.[rootNode]?.specialAssertConfigs ?? []

    //去重，相同的keyPath，保留最新项
    const resultMap = new Map();
    [...specialAssertConfigs, vals].forEach((item) => {
      resultMap.set(item.keyPath, item);
    });
    const uniqueArray = Array.from(resultMap.values());

    const newSubData = modifySubData(subData, `${rootNode}.specialAssertConfigs`, uniqueArray);
    setSubData(newSubData);
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
       * 子节点为基本数据类型并且是yamlData的子节点才支持勾选编辑
       */
      const title = isBasicType ? (
        // isBasicType && itemKey.includes('yamlData') ? (
        <div style={{ display: 'flex' }}>
          <span>{key}：</span>
          <span>
            {editValue ? (
              <EditValue value={String(el)} onEdit={(val) => onEdit(itemKey, val)} />
            ) : (
              String(el)
            )}
          </span>

          {/* 配置特殊校验 */}
          <span style={{ display: assertChecked ? '' : 'none', margin: '0 2px' }}>
            <span style={{ display: noShowConfigSpecialVerif ? 'none' : '' }}>
              <ConfigSpecialVerif
                keyPath={convertToDesiredFormat([itemKey])?.[0]}
                value={String(el)}
                specialAssertConfigs={subData?.[rootNode]?.specialAssertConfigs ?? []}
                onConfirm={(vals: any) => {
                  onConfigSpecialVerif(vals)
                }}
              />
            </span>
          </span>

          <span style={{ marginLeft: 5, display: assertChecked ? '' : 'none' }}>
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
            //  style={{ marginLeft: 15, display: isAllAssert ? '' : 'none' }}
            style={{
              marginLeft: 15,
              display: ['request', 'response', 'eventPayload', 'sofaContext', 'headers'].includes(itemKey) && isAllAssert ? '' : 'none',
            }}
          >
            <Checkbox
              defaultChecked={itemKey === 'response' ? true : false}
              style={{ visibility: isAllAssert ? 'visibility' : 'hidden' as any }}
              checked={allAssert?.length === assertKeys?.length}
              indeterminate={0 < assertKeys?.length && assertKeys?.length < allAssert?.length}
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

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Tree
        treeData={convertToAntdTreeData(renderData)}
        // virtual
        onSelect={(a, b) => {
          // console.log('a', a);
          // console.log('b', b);
        }}
      />
    </div>
  );
};

export default CustomEditor;