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
    padding-bottom: 1rem !important;
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

  .pageWrapper {
    display: flex;
    padding: 0 10px;
    flex-wrap: wrap;
  }
  .tableSec {
    width: calc(100% - 360px);
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
    width: 340px;
    margin: 0 0 0 15px;
    font-size: var(--smallFont);
    background: var(--themeSecColor);
    padding: 15px 10px;
    border-radius: 10px;
    margin-bottom: 20px;

    .timeLineCont {
      max-height: calc(100vh - 250px);
      overflow-y: auto;
      .timeLineItemCont {
        margin: 0 5px;

        margin-bottom: 9px;
        background: var(--themeBackground);
        padding: 10px;
        border-radius: 5px;
        .author {
          font-weight: bold;
        }
        .info {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
`;
