import styled from 'styled-components'
export const Wrapper = styled.div`
  .accordions .accordion {
    --bs-accordion-border-color: #ffffff !important;
  }

  .accordion-item:first-of-type .accordion-button {
    background-color: var(--bs-card-bg) !important;
  }
  .card-cancling-hover {
    box-shadow: 0 0 20px #ffe7e7;
    border-color: #ffa7a7 !important;
  }
  .card-enabling-hover {
    box-shadow: 0 0 20px #c6ffc6;
    border-color: #8eff8e !important;
  }
  .card {
    transition: background-color 0.5s;
  }
`
