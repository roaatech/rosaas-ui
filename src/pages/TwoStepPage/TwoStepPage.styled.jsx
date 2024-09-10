import styled from 'styled-components'

export const Wrapper = styled.div`
  .main-container {
    padding: 4%;
  }
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
`
