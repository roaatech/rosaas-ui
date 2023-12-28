import styled from 'styled-components'
export const Wrapper = styled.div`
  .description {
    max-width: 410px;
    white-space: normal;
  }
  span.label {
    font-size: var(--normalFont);
  }
  .green {
    color: var(--green);
  }
  .red {
    color: var(--red);
  }
  .dynamicButtons {
    margin-left: auto;
    width: fit-content;
    margin-bottom: 1.25rem;
  }
  .lock-active {
    color: var(--second-color);
  }
  .lock-passive {
    color: var(--passive-color);
  }
`
