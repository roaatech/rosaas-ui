import styled from 'styled-components'
export const Wrapper = styled.div`
  .p-progressbar .p-progressbar-value {
    border: 0 none;
    margin: 0;
    background: var(--primary5);
  }
  .p-progressbar {
    height: 3px !important;
    position: fixed;
    top: 0;
    z-index: 0;
    background: var(--primary3);
    width: 100vw;
  }

  .loaderCont {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    background: #41404261;
    align-items: center;
    justify-content: center;
    z-index: 1000000000;
  }

  .loader {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }

  .loader div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid var(--primary-color);
    border-radius: 50%;
    animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--primary-color) transparent transparent transparent;
  }

  .loader div:nth-child(1) {
    animation-delay: -0.45s;
  }

  .loader div:nth-child(2) {
    animation-delay: -0.3s;
  }

  .loader div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes loader {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`
