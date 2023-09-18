import styled from 'styled-components'
export const Wrapper = styled.div`
  .assigned-value {
    color: var(--red);
    font-size: 0.875em;
  }
  .inputIcon {
    position: relative;

    input {
      padding-right: 3rem;
    }
    .buttonCont {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2rem;
      button {
        display: flex;
        border: 0;
        background: unset;
        outline: 0;
        padding: 0;
      }
    }
  }
`
