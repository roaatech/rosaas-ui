import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'
export const Wrapper = styled.main`
  background-image: url(${bg});
  background-size: cover;
  /* background-position: center; */
  .copy {
    position: absolute;
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

  .cardCont {
    background-color: var(--primary1);
  }

  .logo {
    width: 250px;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
`
