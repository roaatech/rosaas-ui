import { styled } from "styled-components";
export const Wrapper = styled.div`
  .bar {
    padding: 5px;
    border-radius: 5px;
    margin: 10px 0;
    border: 1px solid;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .method {
      font-size: var(--smallFont);
      color: var(--themeSecColor);
      padding: 5px 20px;
      border-radius: 5px;
      display: inline-block;
      margin-right: 10px;
    }
 
    .url {
      font-size: 14px;
      color: var(--themeColor) !important;
    } 

    span.title {
      @media (max-width: 600px) {
        width: 100%;
        margin-top: 5px;
      } 
      font-size: 14px;
      margin-right: 10px;
      line-height: 27px;
      font-weight: bold;
    }
  }
`;
