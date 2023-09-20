import styled from 'styled-components'

export const Wrapper = styled.div`
  .timeLineCont {
    max-height: calc(100vh - 390px);
    overflow-y: auto;
    margin-bottom: 10px;

    @media (max-height: 600px) {
      max-height: 350px;
    }
    .time-line-item-container {
      position: relative;
      padding: 0px 15px 9px 15px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: ${localStorage.getItem('direction') == 'rtl'
          ? 'calc(100% - 6px)'
          : '4px'};
        height: 100%;
        border-left: 2px solid #e5e7eb;
      }
      &::after {
        content: '';
        position: absolute;
        top: 8px;
        left: ${localStorage.getItem('direction') == 'rtl'
          ? 'calc(100% - 2px)'
          : '8px'};
        width: 10px;
        height: 10px;
        margin-top: 0.425rem;
        margin-left: -0.5rem;
        border: 2px solid #e5e7eb;
        background: #fff;
        border-radius: 0.5rem;
      }

      .timeLineItemCont {
        background: var(--themeBackground);
        padding: 10px;
        border-radius: 5px;
        .processType {
          font-size: var(--smallFont);
          border: 1px solid;
          padding: 0.05rem 0.5rem;
          border-radius: 7px;
          border-color: var(--surface-400);
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
          .time {
            font-size: var(--smallFont);
          }
        }
      }
    }
  }

  .HealthStatus .label {
    padding: 4px 10px;
    display: inline-block;
  }

  .accordion-button::after {
    display: none;
  }

  .object-content {
    font-size: var(--smallFont);
  }

  .accordionButton {
    padding: 5px 10px;
  }

  .p-dropdown.p-component.p-inputwrapper.p-inputwrapper-filled {
    display: none;
  }

  .p-paginator .p-paginator-first,
  .p-paginator .p-paginator-prev,
  .p-paginator .p-paginator-next,
  .p-paginator .p-paginator-last {
    background-color: transparent;
    border: 0 none;
    color: #6c757d;
    min-width: 1.5rem;
    height: 1.5rem;
    margin: 0.143rem;
    transition: box-shadow 0.2s;
    border-radius: 50%;
  }

  .timeLineCont .time-line-item-container .timeLineItemCont {
    background-color: unset;
    padding-bottom: 3px !important;
  }
  .accordion .accordion-item {
    background-color: var(--themeBackground) !important;
    .accordion-button {
      padding: 0;
      & > span {
        width: 100%;
      }
    }
  }

  .accordionButton span {
    font-weight: 300 !important;
  }
`
