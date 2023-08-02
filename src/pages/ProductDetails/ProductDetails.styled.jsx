import { styled } from 'styled-components'
export const Wrapper = styled.div`
  .p-tabview-panels .card {
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
`
