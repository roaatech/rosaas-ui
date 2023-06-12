import styled from "styled-components";
export const Wrapper = styled.div`
  h4 {
    color: var(--themeColor) !important;
  }

  .breadcrumb {
    margin-bottom: 0.25rem !important;
  }
  .breadcrumb-dark.breadcrumb-transparent .breadcrumb-item.active {
    color: var(--themeColor) !important;
  }
  .breadcrumb-item a {
    color: var(--themeColor) !important;
  }
  .breadcrumb-item::before {
    color: var(--themeColor) !important;
  }
  * {
    color: var(--themeColor) !important;
  }
`;
