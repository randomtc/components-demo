import React, { useState } from 'react';
import { Checkbox } from 'antd';
import CustomEditor from './CustomEditor';
import { mockData } from './mock'
const DomainCase = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([
        'assertChecked', 'editValue', 'isAllAssert', 'isAllCheckbox',
    ]);

    // 控制复选框变化
    const handleCheckboxChange = (checkedValues: any[]) => {
        setSelectedOptions(checkedValues);
    };
    return (
        <div>
            {/* <Checkbox.Group
                options={[
                    { label: 'assertChecked', value: 'assertChecked' },
                    { label: 'editValue', value: 'editValue' },
                    { label: 'isAllAssert', value: 'isAllAssert' },
                    { label: 'isAllCheckbox', value: 'isAllCheckbox' },
                ]}
                value={selectedOptions}
                onChange={handleCheckboxChange}
            /> */}
            <CustomEditor
                data={mockData?.request}
                rootNode='eventPayload'
                assertChecked={true}
                editValue={true}
                isAllAssert={true}
                isAllCheckbox={true}
                onChange={(vals) => {
                    console.log("🚀 ~ DomainCase ~ vals:", vals)

                }}
            />
        </div>
    )
}

export default DomainCase