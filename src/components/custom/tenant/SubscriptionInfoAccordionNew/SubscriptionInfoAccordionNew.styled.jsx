import styled from 'styled-components'
export const Wrapper = styled.div`
  .label {
    margin-right: 0.25rem;
    background: '#eff9f6';
  }
  .green {
    color: var(--green);
    background: '#eff9f6';
  }
  .red {
    color: var(--red);
    background: '#eff9f6';
  }
  .label-white {
    font-size: var(--smallFont);
    font-weight: bold;
    border: 1px solid;
    padding: 7px 12px;
    border-radius: 5px;
    border-color: var(--surface-400);
  }
  /* .label-start {
    font-size: var(--smallFont);
    font-weight: bold;
    border: 1px solid;
    padding: 7px 12px;
    border-radius: 5px;
    border-color: var(--surface-400);
  } */
  .custom-nav-link {
    max-width: 100px;
  }
  .content {
    max-width: 100px;
    margin-left: -45px;
  }
`
