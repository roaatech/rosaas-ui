import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  ${(props) =>
    props.lighter
      ? css`
          font-weight: lighter !important;

          .label {
            font-weight: normal;
          }
        `
      : css`
          .label {
            font-weight: bold;
          }
        `}
  .label {
    padding: 7px 12px;
    border-radius: 5px;
    font-size: var(--smallFont);
    background-color: var(--primary1);
  }
`
