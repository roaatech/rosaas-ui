import styled from "styled-components";

export const Wrapper = styled.div`
  .timeLineCont {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    .timeLineItemCont {
      margin: 0 5px;

      margin-bottom: 9px;
      background: var(--themeBackground);
      padding: 10px;
      border-radius: 5px;
      .author {
        font-weight: bold;
        font-size: 14px;
      }
      .action {
        margin: 2px 0;
        .label {
          font-weight: normal;
          padding: 2px 8px !important;
          border-radius: 5px;
          font-size: var(--smallFont);
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        .time {
          font-size: 10px;
        }
      }
    }
  }
`;
