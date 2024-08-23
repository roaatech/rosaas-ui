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
  .rosaas-management-area-card .card-body {
    background-color: #ffdead3b;
  }
  .product-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .row > * {
    padding-left: 0px;
    padding-right: 0px;
  }
  .row {
    padding-left: 20px;
    padding-right: 20px;
  }

  .product-sentence {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .product-section {
    margin-top: 4rem;
    margin-bottom: 4rem;
    text-align: center;
  }

  .product-section-content {
    max-width: 800px;
    margin: 0 auto;
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
