import { styled } from "styled-components";
export const Wrapper = styled.div`
  max-width: 100%;

  * {
    max-width: 100%;
  }
  .accordion-item {
  }
  .sidebar-text {
    white-space: break-spaces;
    text-wrap: wrap;
    word-wrap: break-word;
  }
  .accordion-item > * {
    transition: 0.5s;
  }
  .accordion-item,
  .accordion-item a {
    background: var(--primaryColor);
  }

  .accordion-button::after {
    content: "▶" !important;
    font-weight: 900;
    font-size: 12px;
    font-family: monospace;
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

  /*.multi-level .nav-link {
    padding-left: 15px;
  }*/
`;
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
`;
