import styled from 'styled-components'
const secondColor = '#ffab03'
export const Wrapper = styled.div`
  .passive-toggle {
    color: #ccc;
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
`
