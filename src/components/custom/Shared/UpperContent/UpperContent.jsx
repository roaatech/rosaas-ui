import React from 'react'
import { Wrapper } from './UpperContent.styled'

const UpperContent = ({ children }) => {
  return (
    <Wrapper>
      <div className="px-4 d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 wrapper py-3">
        {children}
      </div>
    </Wrapper>
  )
}

export default UpperContent
