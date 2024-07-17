import React from 'react'
import { Wrapper } from './Welcome.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />
    </Wrapper>
  )
}

export default Dashboard
