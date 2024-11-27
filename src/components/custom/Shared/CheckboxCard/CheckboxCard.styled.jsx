import styled from 'styled-components'
export const Wrapper = styled.div`
  .check-circle {
    position: absolute;
    bottom: 0%;
    right: 0%;
    color: var(--second-color);
  }
  .checkbox-card {
    cursor: pointer;
    /* border: 1px solid #ccc; */
    transition: all 0.3s ease;
    /* position: relative; */
    text-align: center;
    background-color: rgba(255, 255, 255, 0.345);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .checkbox-card.checked {
    border-color: var(--second-color);
  }
`
