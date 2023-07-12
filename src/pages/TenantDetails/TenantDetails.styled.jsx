import { styled } from "styled-components";
export const Wrapper = styled.div`
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

  .detailsContainer {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
  }
  .detailsInfo {
    width: calc(65% - 15px);
    @media (max-width: 1100px) {
      width: 100%;
    }
  }
  .timeLine {
    @media (max-width: 1100px) {
      margin-top: 20px;
      width: 100%;
      margin-left: 0;
    }
    width: 35%;
    margin: 0 0 0 15px;
    font-size: var(--smallFont);
    background: var(--themeSecColor);
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;

    button:hover {
      opacity: 90%;
    }

    .refresh {
      button.p-button.p-component.p-button-icon-only {
        padding: 0.3rem !important;
        text-align: center;
        min-width: auto;
        width: 40px;
        display: flex;
        margin: 0 10px;
        background: #239dff;
        border-color: #00569b;

        .svg {
          font-size: 22px;
        }
      }
    }
  }
`;
