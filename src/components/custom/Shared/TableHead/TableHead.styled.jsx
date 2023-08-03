import styled from 'styled-components'

export const Wrapper = styled.div`
  .wrapper {
    min-height: 95px;
  }
  input.p-inputtext.p-component {
    background: var(--themeSecColor);
    color: var(--themeColor);
  }

  .p-button.p-button-sm {
    width: 100%;
    background: var(--unThemeBackground);
    color: var(--unThemeColor);
  }
  .p-button.p-button-sm:hover {
    background: var(--themeBackground) !important;
    color: var(--themeColor);
  }
`
