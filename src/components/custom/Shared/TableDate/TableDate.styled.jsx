import styled from "styled-components";

export const Wrapper = styled.div`
  font-size: var(--smallFont);
  /* position: relative; */
  min-height: 20px;
  svg {
    font-size: var(--largeFont);
    margin: auto;
    display: block;
  }

  .dateCont {
    position: absolute;
    margin-left: -1rem;
    background: var(--themeBackground);
    color: var(--themeColor);
    border: 1px solid;
    padding: 0.5rem;
    border-radius: 10px;
    z-index: 10;
    width: 245px;
    text-align: center;
  }
`;
