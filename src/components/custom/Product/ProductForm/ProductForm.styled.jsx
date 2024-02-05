import styled from 'styled-components'
export const Wrapper = styled.div`
  .toggle-container .fa-lg {
    cursor: pointer;
  }
  .active-toggle {
    color: var(--second-color);
  }
  .passive-toggle {
    color: var(--passive-color);
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
