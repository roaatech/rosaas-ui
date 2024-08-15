import styled from 'styled-components'
export const Wrapper = styled.div`
  .passive-toggle {
    color: var(--passive-color);
    cursor: pointer;
  }
  .active-toggle {
    color: var(--second-color);
    cursor: pointer;
  }
  .active-toggle:hover {
    color: #ffab03b4;
    cursor: pointer;
  }
  p.total {
    background-color: #ffab032a;
  }
  .merged-form-group {
    display: flex;
    align-items: stretch;
  }

  .merged-form-group .form-control {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .merged-form-group .btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .normal-text {
    font-weight: normal;
    padding-top: 10px;
  }
  .check-circle {
    color: green;
  }
  .trial {
    color: var(--second-color);
    font-weight: bold;
  }
`
