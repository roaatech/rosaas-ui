import styled from 'styled-components'

export const TextareaCounterWrapper = styled.div`
  .textarea-container {
    position: relative;
    width: 100%;
    padding-bottom: 0;
  }

  .char-counter {
    color: var(--second-color);
    font-size: var(--smallFont);
    position: absolute;
    bottom: -20px;
    right: 0;
    padding-right: 6px;
  }

  .textarea-container textarea {
    min-height: 70px !important;
  }
`