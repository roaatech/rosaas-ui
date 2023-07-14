import { styled } from "styled-components";
export const Wrapper = styled.div`
  tr:last-child {
    border-bottom: 0 !important;
  }

  tr > * {
    color: var(--themeColor) !important;
  }

  .card-body {
    background: var(--themeSecColor);
  }

  tr > td {
    border-color: var(--themeGray) !important;
  }
  tr:last-child > td {
    border-bottom: 0 !important;
  }

  .card.border-light {
    border-color: var(--themeGray) !important;
  }

  
  tr > td.url-container{
    padding-top: 5px;
    padding-bottom: 5px;
  }
  
  /* .main {
    display: flex;
  } */
`;
