import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  .label-container {
    max-width: calc(
      33.333% - 16px
    ); /* Set maximum width for each label container */
    flex-grow: 1; /* Allow labels to grow to fill the remaining space */
  }
`
