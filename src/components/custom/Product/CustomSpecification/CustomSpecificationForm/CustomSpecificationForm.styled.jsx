import styled from 'styled-components'
export const Wrapper = styled.div`
  .form {
    min-width: 2000px;
  }
  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-color: var(--second-color);
    color: var(--second-color);
  }
  .custom-checkbox
    .custom-control-input:checked
    ~ .custom-control-label::before {
    border-color: var(--second-color) !important;
  }

  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: var(--second-color);
  }
  .p-tabview .p-tabview-nav li .p-tabview-nav-link:first-child {
    transition: none;
  }
  .active-toggle {
    color: var(--second-color);
  }
  .passive-toggle {
    color: #ccc;
  }
  .Permission {
    font-weight: 400;
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
