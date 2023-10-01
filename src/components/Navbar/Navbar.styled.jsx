import styled from 'styled-components'
export const Wrapper = styled.div`
  .p-info > div {
    flex-direction: ${(props) => props.direction == 'rtl' && 'row-reverse'};
  }
`
