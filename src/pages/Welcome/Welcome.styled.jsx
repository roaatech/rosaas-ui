import { styled } from 'styled-components'
export const Wrapper = styled.div`
  .custom-container {
    max-width: 300px;
    /* margin-right: auto;
    margin-left: auto; */
  }
  .nav-tabs .nav-link.active {
    background-color: var(--primary-color);
  }
  .link-unit {
    cursor: pointer;
    text-decoration: underline;
  }
  .link-unit:hover {
    color: var(--primary4);
  }
`
