import styled from 'styled-components'
export const Wrapper = styled.div`
  .form {
    min-width: 2000px;
  }
  .p-tabview .p-tabview-nav .p-tabview-title {
    font-size: 12px;
    margin-bottom: -28px;
    margin-top: -20px;
  }
  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-color: var(--second-color);
    color: var(--second-color);
  }
  .p-tabview-nav-content {
    margin-bottom: -20px;
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
    color: var(--passive-color);
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

  .textarea-container textarea {
    max-height: 43.6px !important;
  }

  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    padding: 0.5rem 0.75rem 1rem 0.75rem;
  }

  .table-wrapper.table-responsive {
    padding: 0.75rem 0rem 1rem 0rem;
  }
  .p-tabview .p-tabview-panels {
    padding: 1.25rem 0rem;
  }

  .char-counter {
    font-size: 10px;
  }
  .toggle-container .fa-lg {
    font-size: 1.5em;
    cursor: pointer;
  }
  .borderRight {
    border-right: 1px solid #f1f1f1;
  }
  .borderLeft {
    border-left: 1px solid #f1f1f1;
  }
  .ar-questionCircle {
    transform: scaleX(-1);
  }
`
