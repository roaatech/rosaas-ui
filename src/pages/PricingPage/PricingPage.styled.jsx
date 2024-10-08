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
  .form-check-input {
    cursor: pointer;
  }
  .tab-header.rtl {
    transform: rotate(-30deg) !important;
  }
  .main-container {
    margin: 0 auto;
  }
  .text-seamlessly {
    font-size: var(--largeFont);
  }

  .rtl .form-check {
    direction: rtl;
    text-align: right;
    display: flex;
  }
  .rtl .form-check-input {
    margin-left: 0;
  }

  .align-start-alone {
    margin-right: ${(props) =>
      props.direction == 'ltr' ? 'auto !important' : ''};
    margin-left: ${(props) =>
      props.direction == 'rtl' ? 'auto !important' : ''};
  }
  .check-circle {
    color: green;
  }
  .rtl .form-check-label {
    margin-right: 3px; /* Increase space between checkbox and label */
  }
`
