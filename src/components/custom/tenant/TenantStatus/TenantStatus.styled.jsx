import styled, { css } from "styled-components";
const greenB = css`
  background-color: var(--green);
`;
const redB = css`
  background-color: var(--red);
`;
export const Wrapper = styled.span`
  .p-tag {
    cursor: pointer;
    width: 80px;
    height: 32px;
    font-size: var(--smallFont);
    ${(props) => (props.status == 1 ? greenB : redB)};
    padding: 0 !important;
    box-shadow: 1px 1px 2px 1px var(--gray);
    border: 1px solid;
  }
`;
