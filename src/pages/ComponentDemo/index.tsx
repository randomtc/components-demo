import React from 'react'

import { markdownText } from './mock'
import { Card, Collapse } from 'antd'
import CopyText from '../components/CopyText'
import CustomMarkdown from '../components/CustomMarkdown'
import TextEllipsis from '../components/TextEllipsis'

const ComponentDemo = () => {
    return (
        <div style={{ padding: 24 }}>

            <Collapse items={[{
                key: '1',
                label: 'CopyText',
                children: <CopyText
                    content="复制文本"
                />,
            },
            {
                key: '2',
                label: 'TextEllipsis',
                children: <TextEllipsis width={200} text='这是一段很长的文本这是一段很长的文本这是一段很长的文本这是一段很长的文本这是一段很长的文本' />,
            },
            {
                key: '3',
                label: 'CustomMarkdown',
                children: <CustomMarkdown content={markdownText} />
                ,
            },]} 
            />




        </div>
    )
}

export default ComponentDemo