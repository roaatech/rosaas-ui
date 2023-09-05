import styled from 'styled-components'

export const Wrapper = styled.div`
  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
  }
  .quick-actions {
    height: 56px;
    width: 100%;
  }

  .icon-dark {
    color: #000; /* Change this to your desired color */
  }

  .dropdown-toggle {
    height: 40px;
  }

  .search-input {
    height: 56px;
    width: 100%;
  }

  .input-text-container {
    width: 100%;
    position: relative;

    .form-control {
      border: none;
      width: 100%;
    }
  }
`
