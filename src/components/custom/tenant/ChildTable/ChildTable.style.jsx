import styled from 'styled-components'
const Wrapper = styled.div`
  .dynamicButtons {
    margin-left: auto;
    width: fit-content;
    margin-bottom: 1.25rem;
  }
  .line-cell {
    border-top: 1px solid #000;
    padding-right: 20px;
    padding-left: 20px;
  }
  thead.p-datatable-thead {
    display: none;
  }
  .tabHolder {
    display: flex;
    align-items: center;
    margin-left: 10px;
    .date {
      word-break: break-word;
      display: inline-block;
      white-space: initial;
      min-width: 250px;
      font-weight: 400;
    }
  }

  .status {
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;

    span.statusTitle {
      /* text-transform: capitalize; */
    }
  }
  .accordion-item {
    background-color: #fcfcfc !important;
  }
  .accordion-item .card-body {
    background-color: #fcfcfc !important;
  }
  .accordion-item tr > * {
    color: #787878 !important;
  }
  .accordion-item > * {
    transition: 0.5s;
  }

  .accordion-item tr .fw-bold {
    width: 25%;
  }

  .accordion-body {
    padding: 10px 20px 10px 20px;
    border-radius: 0;

    td {
      white-space: break-spaces;
    }
  }

  .accordion-button {
    background-color: var(--primary0);
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
  .accordion-button:focus {
    box-shadow: unset;
  }

  .accordion-button:hover {
    background-color: var(--primary1);
  }
  .accordion-button:not(.collapsed) {
    background-color: var(--themeBackground); /*var(--primary2);*/
  }

  .checkurl {
    word-break: break-all;
    white-space: break-spaces;
    display: inline-block;
  }
  .firstTd {
    width: 145px;
    padding-right: 0 !important;
  }
  .tableTitle {
    margin: 1rem 0 0.5rem 1rem;
    padding-right: 1rem;
    display: inline-block;
    border-bottom: 1px solid;
  }

  .dispatchCont {
    .card-stats {
      word-wrap: break-word;
      white-space: normal;
      width: 100%;
      text-align: left;
    }
    div {
      font-size: var(--defaultFont);
    }
  }

  .timeLine .card .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .refresh button {
      padding: 3px 7px !important;
    }
  }

  .checksCount svg {
    margin-top: -3px;
  }
`

export { Wrapper }
