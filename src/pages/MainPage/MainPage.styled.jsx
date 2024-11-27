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
    max-width: 100%;
  }
  .redirect-icons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .redirect-card {
    width: 200px;
    height: 100px;
    margin: 0 10px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .redirect-card-product-management {
    min-width: 230px;
    height: 100px;
    margin: 0 10px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .redirect-card-product-management:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    color: var(--second-color);
  }
  .redirect-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    color: var(--second-color);
  }

  .redirect-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
  }

  .redirect-link:hover {
  }
  .next-line {
    margin-top: 4px;
  }
  .redirect-icons span {
    margin-top: 5px;
  }

  .redirect-icons svg {
    font-size: 30px;
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
`
