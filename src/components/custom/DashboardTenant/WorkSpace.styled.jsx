import styled from 'styled-components'

// Define a styled component called Wrapper using styled-components
export const Wrapper = styled.div`
  /* Styling for custom card */
  .custom-card {
    background-color: #f8f9fa; /* Set background color */
    border: 2px solid #ced4da; /* Set border */
    border-radius: 10px; /* Set border radius */
    text-align: center; /* Center align text */
    transition: all 0.5s ease; /* Add transition effect */
    cursor: pointer; /* Set cursor to pointer */
    margin-left: 6px; /* Set left margin */
  }

  /* Styling for custom card on hover */
  .custom-card:hover {
    border-color: var(--second-color-1); /* Change border color on hover */
  }

  /* Styling for active card */
  .active-card {
    border-color: var(--second-color-1); /* Set border color for active card */
    color: var(--second-color); /* Set text color for active card */
  }

  /* Styling for custom card link */
  .custom-card-link {
    text-decoration: none; /* Remove underline from link */
    color: inherit; /* Inherit color from parent */
  }

  /* Styling for carousel indicators */
  .p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button {
    background-color: var(
      --second-color
    ); /* Set background color for carousel indicator button */
  }

  /* Styling for icon */
  .icon {
    font-size: 24px; /* Set font size for icon */
    margin-bottom: 10px; /* Set bottom margin for icon */
  }
`
