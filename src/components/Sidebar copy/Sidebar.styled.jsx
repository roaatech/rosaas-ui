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
    content: "➾" !important;
  }
`;
