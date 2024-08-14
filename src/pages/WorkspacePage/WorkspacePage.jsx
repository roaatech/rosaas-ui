import React from 'react'
import { Wrapper } from './WorkspacePage.styled' // Importing styled components
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb' // Importing BreadcrumbComponent
import WorkSpace from '../../components/custom/DashboardTenant/WorkSpace' // Importing WorkSpace component

// Define a functional component called TenantWelcomePage
const TenantWelcomePage = () => {
  return (
    // Render a Wrapper component to provide styling for the page
    <Wrapper>
      {/* Render BreadcrumbComponent with the breadcrumbInfo prop set to 'Dashboard' */}
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />
      {/* Render a section element to contain WorkSpace component */}
      <section className="pt-8 main-section">
        {/* Render the WorkSpace component */}
        <WorkSpace />
      </section>
    </Wrapper>
  )
}

// Export the TenantWelcomePage component as the default export
export default TenantWelcomePage
