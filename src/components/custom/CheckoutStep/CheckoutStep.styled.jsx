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
  .normal-text {
    font-weight: normal;
    padding-top: 10px;
  }
`
