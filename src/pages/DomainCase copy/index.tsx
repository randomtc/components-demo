import CustomEditor from './CustomEditor';
import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import { mockData } from './mock';
const DomainCase = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([
        'showAssertChecked', 'showEditValue', 'showConfigSpecialVerif',
    ]);

    // 控制复选框变化
    const handleCheckboxChange = (checkedValues: any[]) => {
        setSelectedOptions(checkedValues);
    };
    const [code, setCode] = useState<any>(mockData?.request)
    // console.log("🚀 ~ DomainCase ~ code:", code)
    return (
        <div style={{ padding: 15 }}>

            <div style={{ display: 'flex', fontSize: 12, gap: 24 }}>
                <div style={{ width: 500 }}>
                    <h3>数据源</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f5f5f5', }}>
                        <code>
                            {JSON.stringify(code?.editData?.data, null, 2)}
                        </code>
                    </pre>

                    <h3>选择节点</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f5f5f5', }}>
                        <code>
                            {JSON.stringify(code?.editData?.assertKeys ?? `{}`, null, 2)}
                        </code>
                    </pre>
                    <h3>校验规则</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f5f5f5', }}>
                        <code>
                            {JSON.stringify(code?.editData?.specialAssertConfigs, null, 2)}
                        </code>
                    </pre>
                </div>

                <div>
                    <div style={{ marginBottom: 20 }}>
                        <Checkbox.Group
                            options={[
                                { label: 'Assert', value: 'showAssertChecked' },
                                { label: '编辑', value: 'showEditValue' },
                                { label: '配置', value: 'showConfigSpecialVerif' },
                            ]}
                            value={selectedOptions}
                            onChange={handleCheckboxChange}
                        />
                    </div>

                    <CustomEditor
                        data={{
                            editData:
                            {
                                data: mockData,
                                assertKeys: [
                                    "$.data.request.id",
                                    "$.data.request.paymentMethodTypes[2].bizType"
                                ]
                            }
                        }}
                        rootNode='editData'
                        showAssertChecked={selectedOptions.includes('showAssertChecked')}
                        showEditValue={selectedOptions.includes('showEditValue')}
                        showConfigSpecialVerif={selectedOptions.includes('showConfigSpecialVerif')}
                        isAllAssert={true}
                        // isAllCheckbox={true}
                        onChange={(vals) => {
                            console.log("🚀 ~ DomainCase ~ vals:", vals)
                            setCode(vals)
                        }}
                    />

                </div>
            </div>
        </div>
    )
}

export default DomainCase