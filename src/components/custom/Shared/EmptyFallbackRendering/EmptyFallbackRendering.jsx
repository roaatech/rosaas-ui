import React from 'react'
const EmptyFallbackRendering = ({ data, children }) => {
  return <>{data ? children : '__'}</>
}

export default EmptyFallbackRendering
