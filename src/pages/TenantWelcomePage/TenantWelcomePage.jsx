import React, { useState } from 'react'
import { Wrapper } from './TenantWelcomePage.styled'
import { useEffect } from 'react'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { tenantInfo } from '../../store/slices/tenants'
import DashboardTenant from '../../components/custom/DashboardTenant/DashboardTenant'

const TenantWelcomePage = () => {
  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />
      <section className="pt-8" style={{ minHeight: '100vh' }}>
        <DashboardTenant />
      </section>
    </Wrapper>
  )
}

export default TenantWelcomePage
