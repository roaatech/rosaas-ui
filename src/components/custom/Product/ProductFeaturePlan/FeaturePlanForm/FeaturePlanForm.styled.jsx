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

  .inputIcon {
    position: relative;

    input {
      padding-right: 3rem;
    }
    .buttonCont {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2rem;
      button {
        display: flex;
        border: 0;
        background: unset;
        outline: 0;
        padding: 0;
      }
    }
  }
`
