import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const Wrapper = styled.div`
  background-image: url(${bg});
  background-size: cover;
  .product-name {
    color: #ffbc2b;
  }

  .product-link:hover {
    background-color: #cccccc18;
  }
  .product-link:hover .product-description {
    opacity: 1;
  }

  .product-description {
    position: absolute;
    top: 0;
    right: 0;
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: #cccccc3c; */
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    border-left: 2px solid #ccccccaa;
    padding: 5px;
  }
`
