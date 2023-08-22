import styled from 'styled-components'
export const Wrapper = styled.div`
  button {
    padding: 0.4rem 1rem;
  }

  .action {
    border-radius: 8px;
    overflow: hidden;
  }

  .action button {
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
