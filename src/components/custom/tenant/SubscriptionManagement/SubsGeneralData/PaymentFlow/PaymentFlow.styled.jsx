import styled from 'styled-components'

export const Wrapper = styled.div`
  .timeLineCont {
    max-height: calc(238px);
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
        left: ${(props) =>
          props.direction == 'rtl' ? 'calc(100% - 6px)' : '4px'};
        height: 100%;
        border-left: 2px solid #e5e7eb;
      }
      &::after {
        content: '';
        position: absolute;
        top: 8px;
        left: ${(props) =>
          props.direction == 'rtl' ? 'calc(100% - 2px)' : '8px'};
        width: 10px;
        height: 10px;
        margin-top: 0.425rem;
        margin-left: -0.5rem;
        border: 2px solid #e5e7eb;
        background: #fff;
        border-radius: 0.5rem;
      }

      .timeLineItemCont {
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
`
