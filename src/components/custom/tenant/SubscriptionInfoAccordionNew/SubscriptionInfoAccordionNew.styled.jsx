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
  /* .vertical-tab-panel {
    padding: -20px;
  } */

  /* .p-tabview .p-tabview-nav li {
    width: 100%;
    display: block;
    display: flex;
    flex-wrap: wrap;
  } */
  .table-tabs {
    min-width: 900px;
  }

  .feat-table {
    margin-left: -20px;
  }
  .tabs {
    max-width: 180px;
  }
  .custom-nav-link .nav-link.active {
    border-bottom: 0px;
    border-color: var(--second-color);
    border-width: 2px;
    border-left: 0;
    border-right: 2px solid;
    color: var(--second-color);
    font-weight: 700;
    background-color: transparent;
    border-radius: 0%;
    transition:
      border-color 0.3s,
      color 0.3s,
      font-weight 0.3s,
      background-color 0.3s;
  }
  .custom-nav-link .nav-link {
    font-weight: 700;
    color: #6c757d;

    border-bottom: 0px solid;
    border-left: 0;
    border-right: 2px solid #dee2e6;
    margin-bottom: -17px;
    border-top: 0;
    border-radius: 0%;
    transition:
      border-color 0.3s,
      color 0.3s,
      font-weight 0.3s,
      background-color 0.3s;
  }
  .custom-nav-link {
    margin-left: -20px;
  }

  .feature-value {
    min-width: 110px;
    background-color: red2;
  }
  .remind-value {
    min-width: 150px;
  }
  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
  }
  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    border: solid #dee2e6;
  }
  .hide-tab-content {
    display: none !important;
  }
`
