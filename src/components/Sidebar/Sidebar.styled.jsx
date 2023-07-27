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
    /* margin-top: -5px; */
  }

  .accordion-item {
    border-color: #262b40 !important;
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
