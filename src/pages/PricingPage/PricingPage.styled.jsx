import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const Wrapper = styled.div`
  background-image: url(${bg});
  background-size: cover;

  .form-check-input:checked {
    background-color: var(--second-color);
    border-color: var(--second-color);
  }
  .tab-header {
    transform: rotate(22deg);
  }
  .main-container {
    margin: 0 auto;
  }
  .text-seamlessly {
    font-size: var(--largeFont);
  }
`
