import { styled } from 'styled-components'
export const Wrapper = styled.div`
  /* .row-button {
    width: 100%;
  } */
  .line-cell {
    border-top: 1px solid #000;
    padding-right: 20px;
    padding-left: 20px;
  }
  .dynamicButtons {
    margin-left: 0px;
    margin-top: -15px;
    margin-bottom: 5px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    align-self: flex-start;
  }
  tr:last-child {
    border-bottom: 0 !important;
  }

  tr > * {
    color: var(--themeColor) !important;
  }
  .action button {
    margin-bottom: 10px;
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

  .content-container {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
  }
  .content-details {
    width: calc(65% - 15px);
    @media (max-width: 1100px) {
      width: 100%;
    }
  }
  .timeLine {
    @media (max-width: 1100px) {
      margin-top: 20px;
      width: 100%;
    }
    width: 35%;
    margin: ${(props) =>
      props.direction == 'rtl' ? '0 15px 20px 0' : '0 0 20px 15px'};
    font-size: var(--smallFont);
    background: var(--themeSecColor);
    border-radius: 10px;
  }

  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;

    .refresh {
      button.p-button.p-component.p-button-icon-only {
        padding: 0.3rem !important;
        text-align: center;
        min-width: auto;
        width: 40px;
        display: flex;
        margin: 0 10px;
        background: #239dff !important;
        border-color: #00569b;

        .svg {
          font-size: 22px;
        }
      }
    }
  }
  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-color: var(--second-color);
    color: var(--second-color);
  }

  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: var(--second-color);
  }
`
