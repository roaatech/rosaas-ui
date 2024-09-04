import styled from 'styled-components'
export const Wrapper = styled.div`
  transition: transform 0.7s ease;

  .dynamicButtons {
    margin-left: auto;
    width: fit-content;
    margin-bottom: 1.25rem;
  }
  .description {
    max-width: 200px;
    white-space: normal;
  }
  .SecretMangements {
    background-color: var(--table-hover);
  }
  .icon-transition {
    transition: transform 0.3s ease;
  }

  .icon-rotate {
    transform: rotate(180deg);
  }
`
