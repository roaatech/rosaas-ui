import styled from 'styled-components'
export const Wrapper = styled.div`
  .description {
    max-width: 410px;
    white-space: normal;
  }
  .planFeatureButton {
    font-size: var(--defaultFont);
  }
  .clickable-text,
  .clickable-icon {
    cursor: pointer;
  }

  span.label {
    font-size: var(--normalFont);
    margin-right: 0.25rem;
  }
  .green {
    color: var(--green);
  }
  .grey {
    color: '# ccc';
  }
`
