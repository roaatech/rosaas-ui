import styled from 'styled-components'

export const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  flex-wrap: wrap;
  .p-paginator {
    background: var(--themeSecCol);
  }
  .p-paginator .p-paginator-pages .p-paginator-page.p-highlight,
  .p-paginator .p-dropdown {
    background: var(--themeSecCol);
  }

  .p-paginator.p-component {
    flex-wrap: nowrap;
    /* @media (max-width: 768px) {
      flex-wrap: wrap;
      display: inline-block;
    } */
  }

  .p-paginator .p-paginator-pages .p-paginator-page {
    min-width: 2rem;
    height: 2rem;
  }

  span {
    font-size: var(--normalFont);
  }
  /* 
  @media (max-width: 450px) {
  } */
`
