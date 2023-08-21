import styled from 'styled-components'
export const Wrapper = styled.div`
  .action {
    border-radius: 8px;
    overflow: hidden;
  }

  .action button {
    border-radius: 0;
    border-left: 1px solid;
    margin: 0;
    &:first-child {
      border-left: 0px;
    }
  }
`
