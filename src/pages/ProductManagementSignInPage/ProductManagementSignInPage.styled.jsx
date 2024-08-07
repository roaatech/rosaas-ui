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
  .logo-col {
    border-right: 2px solid #f1f1f1;
    background-color: #d3d3d37a;
  }
  .form-row {
    background-color: var(--primary0);
  }
  .custom-div:hover {
    color: var(--second-color-darker);
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
    /* font-size: var(--hugeFont); */
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
