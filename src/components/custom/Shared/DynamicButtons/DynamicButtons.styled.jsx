import styled from 'styled-components'
export const Wrapper = styled.div`
  width: fit-content;
  border-radius: 8px;
  overflow: hidden;
  background: var(--primary5);
  button {
    padding: 0.4rem 1rem;
  }

  .dynamicAction button {
    border-radius: 0;
    border-left: 1px solid var(--primary3);
    margin: 0;
    &:first-child {
      /* border-left: 0px; */
    }
  }
  .redColor {
    color: var(--red);
  }

  .dropdown-item svg {
    position: relative;
    top: -2px;
  }
`
