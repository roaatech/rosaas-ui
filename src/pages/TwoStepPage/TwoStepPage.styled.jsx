import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const Wrapper = styled.div`
  background-image: url(${bg});
  background-size: cover;
  min-height: 100vh;
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
