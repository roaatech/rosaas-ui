import styled from 'styled-components'

const LoginWrapper = styled.div`
  color: var(--primary4);
  .inputContainer {
    margin-bottom: 1.5rem;
  }
  .inputContainerWithIcon {
    /* border: 2px solid var(--primary4); */
    border-radius: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: white;
  }
  .error-message {
    position: absolute;
  }
  svg {
    margin: 0.5rem 0.75rem;
  }

  input {
    background: transparent;
    /* background: white; */
    border: 0 !important;
    border-radius: 0;
    /* border-left: 2px solid var(--primary4) !important; */
  }

  .p-inputtext:enabled:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: none;
  }
  .recaptcha-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .link-underline {
    text-decoration: underline;
    color: var(--second-color);
    text-decoration-color: var(--second-color) !important;
  }
  .link-underline:hover {
    color: var(--second-color-darker);
  }
`

export default LoginWrapper
