import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  /* .price-label {
    font-weight: lighter !important;
    padding: 0px 10px;
    border-radius: 5px;
    border: 1px solid #cccccc;
    font-size: var(--smallFont);
    min-width: auto;
    margin-right: 2px;
  }

   .old-price-label { 
    text-decoration: line-through;
    color: var(--gray-600);
  } */

  .price-container {
    font-size: var(--defaultFont);
    font-weight: bold;
    color: var(--primary-color);
    padding: 0px 10px;
  }

  .old-price {
    font-size: 0.7rem;
    color: var(--gray-500); /* Use a lighter gray for the old price */
    text-decoration: line-through; /* Strikethrough effect for the old price */
    margin-right: 8px; /* Add space between the old price and new price */
  }

  .current-price {
    color: var(--gray-700); /* Use a darker gray for the current price */
  }
`
