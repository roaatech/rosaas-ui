import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'
export const Wrapper = styled.main`
  background-image: url(${bg});
  background-size: cover;

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

  br {
    display: block; /* Ensures the <br> element is treated as a block */
    content: ''; /* Adds content to the <br> element */
    margin-top: 1rem; /* Adjust the margin top to control spacing */
    border-top: 1px solid white; /* Adds a solid white border on top */
  }

  .rosaas {
    color: var(--second-color);
    font-size: var(--hugeFont);
  }

  .cardCont {
    background-color: var(--primary1);
  }

  .logo {
    width: 200px;
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  .email {
    color: var(--second-color) !important;
  }
`
