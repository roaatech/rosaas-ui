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

  .card.border-light {
    border-color: var(--themeGray) !important;
  }
  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: var(--second-color);
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
  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    color: var(--second-color) !important;
    border-color: var(--second-color) !important;
  }
  .p-icon {
    color: var(--second-color);
  }
  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    color: var(--second-color) !important;
  }
`
