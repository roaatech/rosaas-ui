import styled from "styled-components";
export const Wrapper = styled.div`
  .customHeader {
    display: none;
  }
  .p-datatable.p-datatable-sm .p-datatable-tbody > tr[role="row"]:hover td {
    background-color: var(--table-hover) !important;
  }

  /* .btn-group,
  .btn-group-vertical {
    position: unset !important;
  } */

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


  .dropdown-menu .dropdown-item {
    color: var(--primary5);
  }




`;
