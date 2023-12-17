import styled from 'styled-components'

export const Wrapper = styled.div`
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
    background-color: #ffe8bb !important;
    color: #676668 !important;
  }
  /* .p-steps-current .p-menuitem-link {
    margin-right: 90px;
  } */
`
