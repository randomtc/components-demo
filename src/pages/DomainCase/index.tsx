import React from 'react'
import CustomEditor from './CustomEditor'
import { mockData } from './mock'
const DomainCase = () => {
    return (
        <div>
            <CustomEditor
                data={mockData?.request}
                assertChecked={true}
                editValue={true}
                isAllAssert={true}
                rootNode='eventPayload'
                onChange={(vals)=>{
                    console.log('vals',vals);
                }}
            />
        </div>
    )
}

export default DomainCase