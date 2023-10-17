import styled from 'styled-components'
const secondColor = '#ffab03'
export const Wrapper = styled.div`
  /* .th {
    max-width: 20px;
  }
  .label {
    margin-right: 0.25rem;
    background: '#eff9f6';
  } */
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
  .contents {
    /* max-width: 700px; */
    margin-left: -45px;
  }
  .year {
    padding: -100px;
  }
  .year-tabs {
    margin-left: 100px;
    border-spacing: 0px;
  }

  .custom-nav-link .nav-link.active {
    border-bottom: 0px;

    border-left: ${(props) =>
      props.direction == 'rtl' ? ' 2px solid' : '0px'};
    border-right: ${(props) =>
      props.direction == 'rtl' ? '0px' : ' 2px solid'};
    border-color: var(--second-color) !important;
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
    border-bottom: 0px solid;
    border-left: 0;
    border-right: 2px solid #dee2e6;
    margin-bottom: -17px;
    border-top: 0;
    border-radius: 0%;
    color: #6c757d;

    transition:
      border-color 0.3s,
      color 0.3s,
      font-weight 0.3s,
      background-color 0.3s;
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
`
