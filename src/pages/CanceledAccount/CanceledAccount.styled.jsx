import { Container } from '@themesberg/react-bootstrap'
import { FaExclamationCircle } from 'react-icons/fa'
import styled from 'styled-components'

export const CanceledAccountWrapper = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--slate-gray);
`

export const CanceledAccountMessage = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
`

export const CanceledAccountIcon = styled(FaExclamationCircle)`
  color: #721c24;
  font-size: 3rem;
  margin-bottom: 20px;
`
