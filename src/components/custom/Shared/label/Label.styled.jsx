import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  .lighter {
    font-weight: lighter !important;
  }
  .normal {
    font-weight: bold !important;
  }

  .label {
    padding: 3px 6px;
    border-radius: 5px;
    font-size: var(--smallFont);
    background-color: var(--primary1);
  }
  .small {
    padding: 3px 5px;
    border-radius: 5px;
    font-size: var(--smallFont);
  }
  .clickable {
    text-decoration: underline;
    transition:
      background-color 0.3s ease,
      transform 0.2s ease;
    &:hover {
      filter: brightness(0.9);
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.95);
    }
  }
`
