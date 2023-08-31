import styled from 'styled-components'
export const Wrapper = styled.div`
  background: var(--themeSecColor);
  padding: 10px 25px;
  margin: 0;
  display: flex;

  h4 {
    color: var(--themeColor) !important;
    margin-bottom: 0px;
  }

  .breadcrumb {
    margin-bottom: 0.25rem !important;
  }
  .breadcrumb-dark.breadcrumb-transparent .breadcrumb-item.active {
    color: var(--themeColor) !important;
  }
  .breadcrumb-item a {
    color: var(--themeColor) !important;
  }
  .breadcrumb-item::before {
    color: var(--themeColor) !important;
  }
  * {
    color: var(--themeColor) !important;
  }
  nav.ps-0.pe-2.pb-0.navbar.navbar-expand.navbar-dark {
    padding: 0;
  }
`
