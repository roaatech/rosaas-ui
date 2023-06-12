import { styled } from "styled-components";
export const Wrapper = styled.div`
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
    border-color: var(--gray-700) !important;
  }
  .accordion-button:not(.collapsed) {
    box-shadow: inset 0 calc(-1 * var(--bs-accordion-border-width)) 0
      var(--gray-700) !important;
  }

  .nav-item > .nav-link {
    margin: 3px 10px !important;
  }

  .multi-level .nav-link {
    padding-left: 15px;
  }
`;
