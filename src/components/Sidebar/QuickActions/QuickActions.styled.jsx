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
  .dropdown-menu {
    margin-top: 4px;
  }
  .main-icon {
    height: 18px;
    width: 18px;
    margin-top: 1px;
  }
  .product-icon {
    height: 13px;
    width: 13px;
    margin-bottom: 4px;
  }
  .plus {
    height: 7px;
    width: 7px;
    padding-bottom: 7px;
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
    padding-right: 4px;
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
