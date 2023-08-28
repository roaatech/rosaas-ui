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
    bottom: -17px;
    right: 0;
    padding-right: 6px;
  }

  .description-textarea {
    resize: vertical;
    width: 100%;
  }
`
