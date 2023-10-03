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
    max-width: 700px;
    margin-left: -45px;
  }
  .year {
    padding: -100px;
  }
  .year-tabs {
    margin-left: 100px;
    border-spacing: 0px;
  }
  .vertical-tab-panel {
    padding: -20px;
  }

  /* .p-tabview .p-tabview-nav li {
    width: 100%;
    display: block;
    display: flex;
    flex-wrap: wrap;
  } */
  .features .p-tabview-nav {
    display: flex;
    flex-wrap: wrap;
    max-width: 100px;
    min-width: 100px;
    border-width: 0 2px 0 0;
    padding-right: 120px;
  }

  .p-tabview .p-component {
    display: flex;
  }
  .p-tabview .p-tabview-panel {
    width: 100%;
    display: block;
    display: flex;
    flex-wrap: wrap;
    margin-left: -15px;
    margin-top: -9px;
  }

  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: var(--second-color);
  }
  .table > :not(caption) > * > * {
    border: solid #b2b4b6;
    border-width: 0 0 3px 0;
  }
  .feature-value {
    min-width: 110px;
    background-color: red2;
  }
  .remind-value {
    min-width: 150px;
  }
`
