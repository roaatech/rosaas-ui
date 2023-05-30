import styled from "styled-components";

const LoginWrapper = styled.div`
  .inputContainer {
    margin-bottom: 1.5rem;
  }
  .inputContainerWithIcon {
    border-radius: 7px;
    border: 2px solid var(--gray);
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
    border-left: 1px solid var(--gray) !important;
   }
`;

export default LoginWrapper;
