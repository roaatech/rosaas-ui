import { styled } from 'styled-components'
export const Wrapper = styled.div`
  /* .p-tabview-panels .card .table-wrapper {
    border: 0;
  } */
  .table-wrapper.table-responsive.shadow-sm.card {
    border: 0;
  }
  .p-tabview.p-component {
    /* border: 10px solid var(--themeSecColor);
    background: var(--themeBackground); */

    .p-tabview-panels {
      /* background: var(--themeBackground);
      padding: 1rem; */
      min-height: calc(100vh - 270px);
      /* padding: 0; */
    }
  }

  .p-tabview .p-tabview-nav-btn.p-link:hover {
    color: var(--second-color);
    opacity: 1;
  }
  .p-tabview .p-tabview-nav-btn.p-link {
    opacity: 0.6;
    color: var(--primary-color);
    left: ${(props) => (props.direction == 'rtl' ? '0 !important' : '')};
    right: ${(props) => (props.direction == 'rtl' ? 'auto !important' : '')};
    rotate: ${(props) => (props.direction == 'rtl' ? '180deg' : '')};
  }
  .dynamicButtons {
    margin-bottom: 20px !important;
  }

  .card-body {
    padding: 0px;
    background: unset;
    overflow: auto;
  }

  /***************** */
  .moreTsec {
    display: flex;
  }
  .timeLine {
    background: white;
    margin: 0 9px;
    padding: 12px 7px;
    border-radius: 10px;
  }
  .warnings .p-tabview-nav-link {
    background-color: #ffd90030 !important;
  }

  .error-badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 4px 8px;
    font-size: 12px;
  }
  .timeLineCont {
    max-height: calc(100vh - 220px);
    overflow-y: auto;
    .timeLineItemCont {
      /* margin: 0 5px; */

      margin-bottom: 9px;
      background: var(--themeBackground);
      padding: 10px;
      border-radius: 5px;
      .author {
        font-weight: bold;
        font-size: 14px;
      }
      .action {
        margin: 2px 0;
        .label {
          font-weight: normal;
          padding: 2px 8px !important;
          border-radius: 5px;
          font-size: var(--smallFont);
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        .time {
          font-size: 10px;
        }
      }
    }
  }

  .dropup,
  .dropend,
  .dropdown,
  .dropstart,
  .dropup-center,
  .dropdown-center {
    position: unset !important;
  }

  .table-responsive,
  .card {
    overflow-x: unset !important;
    overflow-y: unset !important;
  }

  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-color: var(--second-color);
    color: var(--second-color);
  }

  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: var(--second-color);
  }
  .p-tabview .p-tabview-nav li .p-tabview-nav-link:first-child {
    transition: none;
  }
  .table.user-table thead th {
    font-size: var(--defaultFont);
  }

  td.red {
    background-color: var(--red2);
  }
  td.green {
    background-color: var(--green2);
  }
`
