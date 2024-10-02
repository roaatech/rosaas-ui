import { styled } from 'styled-components'
export const Wrapper = styled.div`
  max-width: 100%;

  * {
    /* max-width: 100%; */
  }
  .accordion-item {
  }
  .sidebar-text {
    white-space: break-spaces;
    text-wrap: wrap;
    word-wrap: break-word;
  }
  .sidebar-inner {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0.5rem;
    min-height: 93vh;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 1rem;
    background-color: var(--primary6);
    border-top: 1px solid var(--primary4);
    flex-shrink: 0;
  }
  .accordion-item > * {
    transition: 0.5s;
  }
  /* .accordion-item,
  .accordion-item a {
    background: var(--primary6);
  } */
  .accordion-collapse.collapse.show {
    background: var(--primary6);
  }
  .accordion-button::after {
    content: '▶' !important;
    font-weight: 900;
    font-size: 12px;
    font-family: monospace;
    transform: ${(props) => props.direction == 'rtl' && 'rotate(180deg)'};
  }

  .accordion-item {
    border: none;
  }

  .accordion-button:not(.collapsed) {
    box-shadow: none;
    background-color: #2e3650;
    border: 0.0625rem solid #4c5680;
  }

  .nav-item > .nav-link {
    margin: 3px 0px !important;
  }

  .nav-link .sidebar-icon {
    margin: ${(props) =>
      props.direction == 'rtl' ? '0 0 0 0.5rem' : '0 0.5rem 0 0'};
  }
  .multi-level .nav-link {
    /* padding-left: 45px; */
    padding-left: ${(props) => (props.direction == 'rtl' ? '0px' : '20px')};
    padding-right: ${(props) => (props.direction == 'rtl' ? '20px' : '0px')};
  }
  .multi-level .nav-link {
    padding: ${(props) =>
      props.direction == 'rtl'
        ? '0.5rem  45px 0.5rem  0'
        : '0.5rem   0 0.5rem 0 45px'};
  }
`

export const SidebarWrapper = styled.div`
  .logo {
    width: 150px;
    margin: auto;
  }

  .sidebar .nav {
    padding-top: 0 !important;
  }

  .sidebar .nav-item .nav-link {
    border: none;
  }
  .accordion-item {
    background-color: var(--primary7);
  }

  .nav-item.active > .nav-link {
    background-color: var(--primary7);
  }

  .sidebar .nav-item .nav-link:hover {
    background-color: var(--primary4);
  }

  .align-items-center.accordion-button.nav-link {
    background: var(--primary5);
  }
  .align-items-center.accordion-button.nav-link:not(.collapsed) {
    background: var(--primary7);
  }
  .sidebar .nav-link:focus {
    box-shadow: none;
  }
`
