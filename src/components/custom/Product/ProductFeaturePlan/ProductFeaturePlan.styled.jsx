import styled from 'styled-components'
export const Wrapper = styled.div`
  .description {
    max-width: 410px;
    white-space: normal;
  }
  .dynamicButtons {
    margin-left: auto;
    width: fit-content;
    margin-bottom: 1.25rem;
  }
  .fw-normal,
  .fw-normal .planFeatureButton {
    font-size: var(--smallFont);
  }
  .table-title-cell {
    /*background-color: #f9f9f9;*/
    text-align: center;
    font-size: var(--normalFont) !important;
    font-style: italic;
  }
  .clickable-text,
  .clickable-icon {
    cursor: pointer;
  }
  .subscribers-active {
    color: var(--second-color);
  }
  .subscribers-passive {
    color: var(--passive-color);
  }

  span.label {
    font-size: var(--normalFont);
    margin: ${(props) =>
      props.direction == 'rtl' ? '0 0 0 0.25rem' : '0 0.25rem 0 0'};
  }
  .green {
    color: var(--green);
  }
  .grey {
    color: var(--passive-color);
  }
`
