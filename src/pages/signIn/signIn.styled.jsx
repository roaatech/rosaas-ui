import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'
export const Wrapper = styled.main`
  background-image: url(${bg});
  background-size: cover;
  /* background-position: center; */
  .custom-div {
    cursor: pointer;
    color: var(--second-color);
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 1rem;
    text-decoration: underline;
    text-decoration-color: var(--second-color) !important;
  }

  .custom-div:hover {
    color: var(--second-color-darker);
  }
  .super-admin-card {
    background-color: var(--second-color-1) !important;
  }
  .copy {
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 1rem;
    color: var(--primary5);

    .yellow {
      color: var(--second-color);
    }
  }

  .rosaas {
    color: var(--second-color);
    font-size: var(--hugeFont);
  }
  .link-underline {
    text-decoration: underline;
    color: var(--second-color);
    text-decoration-color: var(--second-color) !important;
  }
  .link-underline:hover {
    color: var(--second-color-darker);
  }

  .cardCont {
    background-color: var(--primary1);
  }

  .logo {
    width: 250px;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
`
