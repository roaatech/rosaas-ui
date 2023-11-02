import styled from 'styled-components'
const secondColor = '#ffab03'
export const Wrapper = styled.div`
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

  .info-card .card {
    background-color: transparent;
  }

  .custom-nav-link {
  }
  .contents {
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

    border-right: ${(props) =>
      props.direction == 'rtl' ? '0px' : ' 2px solid'};
    border-left: ${(props) =>
      props.direction == 'rtl' ? ' 2px solid' : '0px'};
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
    border-right: ${(props) =>
      props.direction == 'rtl' ? '0px' : ' 2px solid #dee2e6'};
    border-left: ${(props) =>
      props.direction == 'rtl' ? ' 2px solid #dee2e6' : '0px'};
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
  .custom-nav-link .nav-link:hover {
    border-color: #6c757d;

    transition:
      border-color 0.3s,
      color 0.3s,
      font-weight 0.3s,
      background-color 0.3s;
  }

  .p-tabview .p-tabview-panels {
    padding: 5px;
    background-color: transparent;
  }
  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    border: solid #dee2e6;
    background-color: transparent;
  }
  .p-tabview .p-tabview-nav {
    background-color: transparent;
  }
  .hide-tab-content {
    display: none !important;
  }
  .table td {
    max-width: auto;
    padding-right: 6px;
    padding-left: 0px;
  }
  .table th {
    max-width: auto;
    padding-right: 6px;
    padding-left: 0px;
  }

  .vertical-tab {
    display: flex;
    flex-direction: column;
  }
  .subscription-info {
    border-bottom: 1px solid #000;
    border-color: var(--surface-400);
    padding: 20px;
  }
  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-color: var(--second-color);
    color: var(--second-color);
  }
  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: var(--second-color);
  }
  @media screen and (max-width: 768px) {
    .vertical-tab {
      flex-direction: row !important;
    }
    .custom-nav-link {
      max-width: auto;
    }
    .custom-nav-link .nav-link.active {
      border-bottom: 0px;

      border-bottom: 2px solid;
      border-right: 0px;
      border-left: 0px;
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
      border-bottom: 2px solid #dee2e6;
      border-right: 0px;
      border-left: 0px;
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
    .custom-nav-link .nav-link:hover {
      border-bottom: 2px solid #6c757d;

      transition:
        border-color 0.3s,
        color 0.3s,
        font-weight 0.3s,
        background-color 0.3s;
    }
  }
`
