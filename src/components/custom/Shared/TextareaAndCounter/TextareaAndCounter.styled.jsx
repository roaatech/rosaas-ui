import styled from 'styled-components';

export const TextareaCounterWrapper = styled.div`
  .textarea-container {
    position: relative;
    width: 100%;
    padding-bottom: 17px;
    
  }

  .char-counter {
    color: var(--second-color);
    font-size: var(--smallFont);
    position: absolute;
    bottom: 0;
    right: 0;
    padding-right: 6px;
  }

  .description-textarea {
    resize: vertical;
    width: 100%;
  }
`;