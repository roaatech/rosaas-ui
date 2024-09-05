import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  .price-label {
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
  }

      
`
