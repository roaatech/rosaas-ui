import styled from 'styled-components'
const darkColor = '#414042'
export const Wrapper = styled.div`
  background: ${(props) => (props.darkMode ? darkColor : 'white')};
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
    padding: ${(props) => props.direction == 'rtl' && '0 0 0 10px '};
    float: ${(props) => props.direction == 'rtl' && 'right'};
  }

  .breadcrumb-item + .breadcrumb-item {
    padding: ${(props) => props.direction == 'rtl' && '0 10px 0 0'};
  }

  * {
    color: var(--themeColor) !important;
  }
  nav.ps-0.pe-2.pb-0.navbar.navbar-expand.navbar-dark {
    padding: 0;
  }
`
