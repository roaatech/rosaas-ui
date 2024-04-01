import { styled } from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const Wrapper = styled.div`
  background-image: url(${bg}); // Set the background image using imported image
  background-size: auto; // Set background size to auto
  .main-section {
    min-height: 100vh;
  }
  .custom-card {
    background-color: var(--pale-moonlight-gray);
  }
  .card {
    background-color: var(--pale-moonlight-gray);
  }
`
