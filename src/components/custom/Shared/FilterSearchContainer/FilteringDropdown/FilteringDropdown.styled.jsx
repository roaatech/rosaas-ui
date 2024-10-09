import styled from 'styled-components'

export const Wrapper = styled.div`
  .p-dropdown:not(.p-disabled) {
    border-color: #ced4da !important;
  }
  .p-dropdown:not(.p-disabled):hover,
  .p-dropdown:not(.p-disabled):focus {
    border-color: var(--second-color) !important;
    box-shadow: 0 0 0 0.2rem var(--second-color-1) !important;
  }
`
