import styled from "styled-components";

export const Wrapper = styled.div`
  background: var(--blue-50);
  align-items: center;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  .p-paginator.p-component {
    display: inline-block;
  }
  span {
    font-size: var(--normalFont);
  }
`;
