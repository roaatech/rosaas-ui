import styled from 'styled-components'
export const Wrapper = styled.div`
  background-color: #f8d7da28;

  .canceled-tenant {
    .table-wrapper {
      border: 3px solid #f5c6cb !important;
    }

    .text-dark {
      color: #721c24 !important;
    }
  }
  .p-datatable.p-datatable-sm .p-datatable-tbody > tr > td,
  .p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
    text-align: center !important;
    vertical-align: middle !important;
  }
  .p-datatable .p-column-header-content {
    display: block;
    align-items: center;
  }
  .p-datatable .p-column-header-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .name {
    min-width: 238.13px;
  }
  .plan {
    min-width: 177px;
  }
`
