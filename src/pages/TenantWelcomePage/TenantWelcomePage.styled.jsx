import { styled } from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const Wrapper = styled.div`
  .custom-container {
    max-width: 300px;
    /* margin-right: auto;
    margin-left: auto; */
  }
  background-image: url(${bg});
  background-size: cover;
  .custom-card {
    background-color: var(--pale-moonlight-gray);
  }
  .card {
    background-color: var(--pale-moonlight-gray);
  }
`
