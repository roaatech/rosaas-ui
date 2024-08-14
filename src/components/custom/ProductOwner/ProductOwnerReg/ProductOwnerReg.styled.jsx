import styled from 'styled-components'

const Wrapper = styled.div`
  color: var(--primary4);
  .inputContainer {
    margin-bottom: 1.5rem;
  }

  .recaptcha-container {
    display: flex;
    justify-content: center;
    align-items: center;
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
  br {
    display: block; /* Ensures the <br> element is treated as a block */
    content: ''; /* Adds content to the <br> element */
    margin-top: 1rem; /* Adjust the margin top to control spacing */
    border-top: 1px solid white; /* Adds a solid white border on top */
  }

  .p-inputtext:enabled:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: none;
  }
`

export default Wrapper
