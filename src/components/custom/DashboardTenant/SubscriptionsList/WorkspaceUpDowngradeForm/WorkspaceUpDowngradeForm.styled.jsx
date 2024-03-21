import styled from 'styled-components'
export const Wrapper = styled.div`
  .p-listbox .p-listbox-list .p-listbox-item:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: inset 0 0 0 0.15rem var(--second-color-1);
  }
  .p-listbox .p-listbox-list .p-listbox-item.p-highlight {
    color: var(--primary5);
    background: var(--second-color-1);
  }

  .form-check-label {
    font-weight: lighter;
    color: var(--primary5);
  }
  .form-check-input:checked {
    background-color: var(--second-color);
    border-color: var(--second-color);
  }
  .p-listbox-item {
    border: 2px !important;
    border-color: var(--second-color);
  }
  .p-listbox .p-listbox-list .p-listbox-item {
    border-bottom: 1px solid var(--misty-gray) !important;
  }
`
