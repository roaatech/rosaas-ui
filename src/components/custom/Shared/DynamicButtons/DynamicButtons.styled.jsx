import styled from 'styled-components'
export const Wrapper = styled.div`
  width: fit-content;

  button {
    padding: 0.4rem 1rem;
  }
  .dynamicAction {
    overflow: hidden;
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

  .dropdown > button {
    border-radius: ${localStorage.getItem('direction') == 'rtl'
      ? ' 8px 0 0 8px '
      : '0 8px 8px 0'};
  }
`
