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
  .p-listbox .p-listbox-list .p-listbox-item {
    border-bottom: 1px solid var(--misty-gray) !important;
  }
  .cycleCountContainer {
    position: relative;
  }

  .cyclePrice {
    position: absolute;
    top: 50%;
    right: 33px; /* Adjust the distance from the right side as needed */
    transform: translateY(-50%);
  }
`
