import React from "react";
import { Button, Checkbox, Input, Space } from "@alipay/bigfish/antd";
import { SearchOutlined } from "@alipay/bigfish/icons";
 export interface Columns {
  SearchCallBack: ({
    selectedKeys,
    dataIndex,
  }: {
    selectedKeys: string | string[];
    dataIndex: string;
  }) => void;

  ColumnFilterProps: {
    dataIndex: string;
    list: { label: string; value: string | number }[];
    callBack: Columns["SearchCallBack"];
    more?: boolean;
  };
}
export const getColumnSearch = (
  dataIndex: string,
  callBack: Columns["SearchCallBack"]
) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys}
          onChange={(e) => setSelectedKeys(e.target.value ?? "")}
          style={{ marginBottom: 8, display: "block" }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => {
              confirm();
              callBack({ selectedKeys, dataIndex });
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys("");
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    );
  },

  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});

/**
 * @param more 支持多选
 */
export const getColumnFilter = ({
  dataIndex,
  list,
  callBack,
  more,
}: Columns["ColumnFilterProps"]) => {
  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => {
      return (
        <div style={{ padding: 8 }}>
          <div style={{ margin: "0 0 8px 0 " }}>
            <Checkbox.Group
              value={selectedKeys}
              onChange={(arr) => {
                if (more) {
                  setSelectedKeys(arr);
                } else {
                  setSelectedKeys([arr.at(-1)]);
                }
              }}
            >
              {list?.map((item) => {
                return (
                  <React.Fragment key={item?.value}>
                    <Checkbox value={item?.value}>{item.label}</Checkbox>
                    <br />
                  </React.Fragment>
                );
              })}
            </Checkbox.Group>
          </div>

          <Space>
            <Button
              onClick={() => {
                setSelectedKeys("");
              }}
              size="small"
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                callBack({ selectedKeys, dataIndex });
              }}
              size="small"
            >
              搜索
            </Button>
          </Space>
        </div>
      );
    },
  };
};

// 使用
export const columns = ({
  searchCallBack,
  onChangePersonnel,
}: ColumnsProps): any => {
  return [
    {
      title: "一级架构域",
      dataIndex: "primArchDomain",
      fixed: "left",
      render: (text: any) => {
        return text || "-";
      },
    },
    {
      title: "二级架构域",
      dataIndex: "secArchDomain",
      fixed: "left",
      ...getColumnFilter("level", [
        { text: "高", value: 1 },
        { text: "中", value: 2 },
        { text: "低", value: 3 },
      ]),
      render: (text: any) => {
        return text || "-";
      },
    },
    {
      title: "应用名",
      fixed: "left",
      dataIndex: "appName",
      ...getColumnSearch("appName", searchCallBack),
      render: (text: any) => {
        return text || "-";
      },
    }
]