import { styled } from 'styled-components'
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

  .description-textarea{
    width: 100%;
    height:auto;
    resize:vertical;
    border: none;
    background-color: transparent;
    font-size: 14px;
    line-height: 1.5;
  }
`
