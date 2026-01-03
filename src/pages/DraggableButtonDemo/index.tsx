import DraggableButton from '@/components/DraggableButton'
import React from 'react'

const Index = () => {
  return (
    <div>
      <DraggableButton
        content={<div style={{ width: 500, height: 720, backgroundColor: 'pink' }}>222</div>}
      />
    </div>
  )
}

export default Index