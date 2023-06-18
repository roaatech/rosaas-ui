import styled from "styled-components";
export const Wrapper = styled.div`
  /* .customHeader {
    display: none;
  } */

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
    .timeLineCont {
      max-height: calc(100vh - 200px);
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
