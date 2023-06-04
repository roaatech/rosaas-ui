import styled from "styled-components";

export const Wrapper = styled.div`
  font-size: var(--smallFont);
  position: relative;
  min-height: 20px;
  svg {
    font-size: var(--largeFont);
    margin: auto;
    display: block;
  }

  .dateCont {
    position: absolute;
    background: white;
    border: 1px solid var(--gray);
    padding: 0.5rem;
    border-radius: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 245px;
    text-align: center;
  }
`;
