import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  .lighter {
    font-weight: lighter !important;
  }
  .normal {
    font-weight: bold !important;
  }

  .label {
    padding: 4px 6px;
    border-radius: 5px;
    font-size: var(--smallFont);
    background-color: var(--primary1);
  }
  .small {
    padding: 3px 5px;
    border-radius: 5px;
    font-size: var(--smallFont);
  }
`
