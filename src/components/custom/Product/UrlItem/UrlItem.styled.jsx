import { styled } from 'styled-components'
export const Wrapper = styled.div`
  .info {
    display: flex;
    flex: auto;
  }
  .url-input {
    max-height: 25px !important;
  }
  /* .enabled {
    color: var(--second-color);
  }
  .enabled:hover {
    color: #cb8700;
  } */
  .disabled {
    color: #cdcdcd !important;
  }
  .disabled-edit {
    color: var(--second-color);
  }
  .bar {
    padding: 5px;
    border-radius: 5px;
    margin: 0px 0;
    border: 1px solid;
    display: flex;
    justify-content: space-between;
    /* flex-wrap: wrap; */

    .method {
      font-size: var(--smallFont);
      color: var(--themeSecColor);
      padding: 3px 20px;
      border-radius: 5px;
      display: inline-block;
      margin: ${(props) =>
        props.direction == 'rtl' ? '0 0 0 10px' : '0 10px 0 0'};
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

    .copyItem {
      font-size: var(--normalFont);
      cursor: pointer;
    }
  }
`
