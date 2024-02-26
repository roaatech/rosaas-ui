import styled from 'styled-components'

export const Wrapper = styled.div`
  .custom-card {
    background-color: #f8f9fa;
    border: 2px solid #ced4da;
    border-radius: 10px;
    /* padding: 20px; */
    text-align: center;
    transition: all 0.5s ease;
    cursor: pointer;
  }

  .custom-card:hover {
    border-color: var(--second-color-1);
    /* color: var(--second-color); */

    /* background-color: var(--second-color-1); */
  }

  .active-card {
    border-color: var(--second-color-1);
    color: var(--second-color);
  }

  .custom-card-link {
    text-decoration: none;
    color: inherit;
  }
  .p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button {
    background-color: var(--second-color);
  }
  .icon {
    font-size: 24px;
    margin-bottom: 10px;
  }
`
