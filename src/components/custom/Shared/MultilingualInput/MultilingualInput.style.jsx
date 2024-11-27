import styled from 'styled-components'
export const Wrapper = styled.div`
  .p-tabview .p-tabview-nav .p-tabview-title {
    font-size: 12px;
    margin-bottom: -28px;
    margin-top: -20px;
  }

  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-color: var(--second-color);
    color: var(--second-color);
  }

  .p-tabview-nav-content {
    margin-bottom: -20px;
  }

  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: var(--second-color);
  }

  .p-tabview .p-tabview-nav li .p-tabview-nav-link:first-child {
    transition: none;
  }

  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    padding: 0.5rem 0.75rem 1rem 0.75rem;
  }

  .p-tabview .p-tabview-panels {
    padding: 1.25rem 0rem;
  }

  .char-counter {
    font-size: 10px;
  }

  .ar-questionCircle {
    transform: scaleX(-1);
  }
`
