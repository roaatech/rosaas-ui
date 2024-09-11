import styled from 'styled-components'

// Create a styled component for the wrapper
export const Wrapper = styled.div`
  .p-menubar {
    width: 100%;
    display: flex;
    position: fixed;
    align-items: center;
    /* top: 0; */
    z-index: 1000;
  }
  .p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link .p-menuitem-text {
    color: var(--second-color) !important;
  }
  .p-menubar
    .p-menubar-root-list
    > .p-menuitem.p-menuitem-active
    > .p-menuitem-link
    .p-menuitem-icon,
  .p-menubar
    .p-menubar-root-list
    > .p-menuitem.p-menuitem-active
    > .p-menuitem-link:not(.p-disabled):hover
    .p-menuitem-icon {
    color: var(--second-color) !important;
  }
  .p-menubar .p-menubar-custom,
  .p-menubar .p-menubar-end {
    margin-left: 0px;
  }

  .p-menubar
    .p-menubar-root-list
    > .p-menuitem.p-menuitem-active
    > .p-menuitem-link,
  .p-menubar
    .p-menubar-root-list
    > .p-menuitem.p-menuitem-active
    > .p-menuitem-link:not(.p-disabled):hover {
    background: var(--second-color-2) !important;
  }

  .p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link .p-menuitem-icon,
  .p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link .p-submenu-icon {
    color: var(--second-color) !important;
  }
  .p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link {
    background: var(--second-color-2) !important;
  }
  .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link:focus {
    box-shadow: inset 0 0 0 0.15rem var(--second-color-1);
  }
  .p-menuitem-link:hover {
    box-shadow: inset 0 0 0 0.15rem var(--second-color-1);
  }
  .p-menubar .p-menuitem-link:focus {
    box-shadow: inset 0 0 0 0.15rem var(--second-color-1);
  }
`
