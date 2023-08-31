import styled from "styled-components";

export const Wrapper = styled.div`
.timeLineCont {
  max-height: calc(100vh - 220px);
  overflow-y: auto; 
  margin-bottom: 10px;
  .time-line-item-container{
    position: relative;
    padding: 0px 15px 9px 15px; 

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 4px;
      height: 100%;
      border-left: 2px solid #e5e7eb;
    } 
    &::after {
      content: "";
      position: absolute;
      top: 31px;
      left: 8px;
      width: 10px;
      height: 10px;
      margin-top: 0.425rem;
      margin-left: -0.5rem;
      border: 2px solid #e5e7eb;
      background: #fff;
      border-radius: 0.5rem;
    }

  .timeLineItemCont { 
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
}
`;
