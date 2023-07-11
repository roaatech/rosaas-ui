import styled from "styled-components";

export const Wrapper = styled.div`
  background: var(--blue-50);
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  flex-wrap: wrap;
  .p-paginator.p-component {
    flex-wrap: nowrap;
    /* @media (max-width: 768px) {
      flex-wrap: wrap;
      display: inline-block;
    } */
  }
  span {
    font-size: var(--normalFont);
  }
`;
