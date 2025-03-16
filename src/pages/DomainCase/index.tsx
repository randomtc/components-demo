import React from 'react'
import CustomEditor from './CustomEditor'
import { mockData } from './mock'
const DomainCase = () => {
    return (
        <div>
            <CustomEditor
                data={mockData?.request}
                rootNode='eventPayload'
                assertChecked={true}
                editValue={true}
                isAllAssert={true}
                isAllCheckbox={true}
                onChange={(vals) => {
                    console.log('vals', vals);
                }}
            />
        </div>
    )
}

export default DomainCase