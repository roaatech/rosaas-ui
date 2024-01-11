import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const Wrapper = styled.div`
  background-image: url(${bg});
  background-size: cover;
  .product-name {
    color: #ffbc2b;
  }

  .product-link:hover {
    background-color: #cccccc49;
  }
  .product-link:hover .product-description {
    opacity: 1;
  }
  .product-description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%; /* optional, depends on your layout */
  }
`
