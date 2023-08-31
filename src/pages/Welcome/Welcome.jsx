import React from 'react'
import { Wrapper } from './Welcome.styled'
import { useEffect } from 'react'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'

const Dashboard = () => {
  useEffect(() => {
    document.title = 'ROSAS-Dashboard'
  }, [])

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />
    </Wrapper>
  )
}

export default Dashboard
