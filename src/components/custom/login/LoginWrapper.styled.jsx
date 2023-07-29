import styled from "styled-components";

const LoginWrapper = styled.div`
  .inputContainer {
    margin-bottom: 1.5rem;
  }
  .inputContainerWithIcon {
    border-radius: 7px;
    border: 2px solid var(--primary4);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .error-message {
    position: absolute;
  }
  svg {
    margin: 0.5rem 0.75rem;
  }

  input {
    background: white;
    border: 0 !important;
    border-radius: 0;
    border-left: 2px solid var(--primary4) !important;
  }


  .p-inputtext:enabled:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: none;
  }

`;

export default LoginWrapper;
