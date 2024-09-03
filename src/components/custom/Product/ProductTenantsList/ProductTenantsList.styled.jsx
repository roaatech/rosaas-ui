import styled from 'styled-components'
export const Wrapper = styled.div`
  .dynamicButtons {
    margin-left: auto;
    width: fit-content;
    margin-bottom: 1.25rem;
  }
  .sort-icon {
    cursor: pointer; /* Change cursor to pointer on hover */
    margin-left: 8px; /* Adds spacing between text and icon */
    color: gray; /* Sets icon color to gray */
    transition: color 0.2s; /* Adds a smooth transition for color change */
  }

  .sort-icon:hover {
    color: black; /* Changes color on hover */
  }
`
