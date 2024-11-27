import { styled } from 'styled-components'
export const Wrapper = styled.div`
  tr:last-child {
    border-bottom: 0 !important;
  }

  tr > * {
    color: var(--themeColor) !important;
  }

  /* .card-body {
    background: var(--themeSecColor);
  } */

  tr > td {
    border-color: var(--themeGray) !important;
  }
  tr:last-child > td {
    border-bottom: 0 !important;
  }
  .dark-tog-btn.tog-btn-off.last-tog-btn {
    background-color: var(--bs-btn-color);
    color: var(--bs-btn-bg);
    border: 1px solid var(--bs-btn-border-color) !important;
    border-radius: 0rem 0.5rem 0.5rem 0rem;
  }
  .card.border-light {
    border-color: var(--themeGray) !important;
  }

  .dynamicButtons {
    margin-left: auto;
    width: fit-content;
    margin-bottom: 1.25rem;
  }

  tr > td.url-container {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .question svg {
    font-size: 0.7rem;
    margin-bottom: 0.2rem;
  }

  .apikeyTd {
    display: flex;
    justify-content: space-between;
    margin-right: 5px;
    span.copyItem {
      font-size: var(--normalFont);
    }
  }
`
