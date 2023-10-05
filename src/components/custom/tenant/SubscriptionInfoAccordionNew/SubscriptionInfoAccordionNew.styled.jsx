import styled from 'styled-components'
export const Wrapper = styled.div`
  .th {
    max-width: 20px;
  }
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
  /* .table-tabs {
    min-width: 900px;
  } */
  .custom-tabview {
    max-width: 700px;
  }
  .feat-table {
    margin-left: -20px;
    max-width: 120px;
  }
  .table-res {
    max-width: 500px;
  }
  .tabs {
    max-width: 180px;
  }

  .custom-nav-link .nav-link.active {
    border-bottom: 0px;

    border-left: ${(props) =>
      props.direction == 'rtl' ? '0' : ' 2px solid var(--second-color)'};
    border-right: ${(props) =>
      props.direction == 'rtl' ? ' 2px solid var(--second-color)' : '0'};
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
  .table td {
    max-width: auto;
    padding-right: 10px;
    padding-left: 20px;
  }
  .main-card {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
  }
`
