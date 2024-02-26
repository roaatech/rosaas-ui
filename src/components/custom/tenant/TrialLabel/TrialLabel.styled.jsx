import styled from 'styled-components'
export const Wrapper = styled.div`
  .trial-label {
    position: relative;
    display: inline-flex;
    /* align-items: center; */
    justify-content: center;
    color: red;
    font-size: 14px;
    font-weight: bold;
    transform: rotate(8deg);
    padding-left: 12px;
  }

  .top-line,
  .bottom-line {
    position: absolute;
    height: 2px;
    background-color: red;
    width: 60px;
  }

  .top-line {
    top: -2px;
  }

  .bottom-line {
    bottom: -2px;
  }

  .trial-text {
    z-index: 1;
    display: inline;
  }
`
