import styled from 'styled-components'
export const Wrapper = styled.div`
  .green {
    color: var(--green);
    background: 'var(--green2)';
  }
  .red {
    color: var(--red);
    background: 'var(--green2)';
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
  .tab-header {
    display: flex;
    align-items: center;
  }
  .custom-nav-link .nav-link.active {
    border-bottom: 0px;

    border-right: ${(props) =>
      props.direction == 'rtl' ? '0px' : ' 3px solid'};
    border-left: ${(props) =>
      props.direction == 'rtl' ? ' 3px solid' : '0px'};
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
      props.direction == 'rtl' ? '0px' : ' 3px solid #dee2e6'};
    border-left: ${(props) =>
      props.direction == 'rtl' ? ' 3px solid #dee2e6' : '0px'};
    margin-bottom: -17px;
    border-top: 0;
    border-radius: 0%;
    color: var(--slate-gray);

    transition:
      border-color 0.3s,
      color 0.3s,
      font-weight 0.3s,
      background-color 0.3s;
  }
  .custom-nav-link .nav-link:hover {
    border-color: rgba(108, 117, 125, 0.5);

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

  .vertical-tab {
    display: flex;
    flex-direction: column;
  }
  .feat-tab {
    box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.04);
    padding-bottom: 3px;
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
  .passive-toggle {
    color: var(--passive-color);
    cursor: pointer;
  }
  .active-toggle {
    color: var(--second-color);
    cursor: pointer;
  }
  .active-toggle:hover {
    color: #ffab03b4;
    cursor: pointer;
  }
  .active-reset {
    cursor: pointer;
    color: var(--second-color);
  }
  .passive-reset {
    color: var(--passive-color);
  }
  .active-reset:hover {
    color: #ffab03b4;
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
      color: var(--slate-gray);

      transition:
        border-color 0.3s,
        color 0.3s,
        font-weight 0.3s,
        background-color 0.3s;
    }
    .custom-nav-link .nav-link:hover {
      border-bottom: 2px solid var(--slate-gray);

      transition:
        border-color 0.3s,
        color 0.3s,
        font-weight 0.3s,
        background-color 0.3s;
    }
  }
`
