import styled from 'styled-components'
export const Wrapper = styled.div`
  .p-info > div {
    flex-direction: ${localStorage.getItem('direction') === 'rtl' &&
    'row-reverse'};
  }
`
