import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  .addNew {
    margin-right: 10px;
  }
  input.p-inputtext.p-component {
    background: var(--themeBackground);
    color: var(--themeColor);
  }

  .p-button.p-button-sm {
    background: var(--unThemeBackground);
    color: var(--unThemeColor);
  }
  .p-button.p-button-sm:hover {
    background: var(--themeBackground) !important;
    color: var(--themeColor);
  }
`;
