import React from 'react'
import { Wrapper } from './UpperContent.styled'

const UpperContent = ({ children }) => {
  return (
    <Wrapper>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 wrapper px-3">
        {children}
      </div>
    </Wrapper>
  )
}

export default UpperContent
