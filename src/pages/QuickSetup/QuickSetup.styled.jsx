import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const QuickSetupWrapper = styled.div`
  background-image: url(${bg});
  background-size: cover;
  min-height: 100vh;

  .p-steps .p-steps-current.p-steps-item:before {
    border-color: var(--second-color) !important;
  }
  .p-steps {
    /* max-width: 500px; */
  }
  .p-steps-item {
    /* max-width: 250px; */
    text-align: center;
  }

  .p-steps-current .p-steps-title {
    color: var(--second-color) !important;
  }
  .p-steps-current .p-steps-number {
    background-color: var(--second-color) !important;
    color: var(--primary4) !important;
  }
  .form-check-input:checked {
    background-color: var(--second-color);
    border-color: var(--second-color);
  }
  .hidden {
    display: none;
  }
  .ebWoEC .p-tabview .p-tabview-panels {
    background-color: var(--themeBackground) !important;
  }
  .p-tabview-nav {
    background-color: var(--themeBackground) !important;
  }
  .ebWoEC .p-tabview .p-tabview-nav li .p-tabview-nav-link:first-child {
    background-color: var(--themeBackground) !important;
  }

  .table-responsive,
  .card {
    background-color: var(--themeBackground) !important;
  }
  .p-tabview-panels {
    background-color: var(--themeBackground) !important;
  }
  .p-menuitem-link,
  .p-tabview-nav-link,
  .p-tabview-panels {
    background: unset !important;
  }
  .table-responsive,
  .card {
    overflow-x: unset !important;
    overflow-y: unset !important;
  }
`
