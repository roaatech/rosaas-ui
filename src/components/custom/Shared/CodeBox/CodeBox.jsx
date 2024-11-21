import { useState } from 'react'
import { FaCopy, FaEye } from 'react-icons/fa'
import SyntaxHighlighter from 'react-syntax-highlighter'
import styled from 'styled-components'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'
import { AiFillCopy } from 'react-icons/ai'
import { CodeBoxButtonWrapper } from './CodeBox.styled'

const CodeBoxWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 1rem;
  background-color: var(--primary0);
`

const CodeBox = ({ codeString, language, previewOnClick }) => {
  const [toolTipText, setToolTipText] = useState('Copy code')

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString)
    setToolTipText(SafeFormatMessage({ id: 'Copied!' }))
    setTimeout(() => {
      setToolTipText(SafeFormatMessage({ id: 'Copy-Code' }))
    }, 2000)
  }

  return (
    <CodeBoxWrapper>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h6 style={{ margin: 0 }}>{language}</h6>
        <div className="d-flex align-items-center">
          <div
            onClick={handleCopy}
            variant="outline-primary"
            className=" px-2  border-left-2 border-light"
          >
            <CodeBoxButtonWrapper>
              <AiFillCopy /> {toolTipText}
            </CodeBoxButtonWrapper>
          </div>
          {previewOnClick && (
            <div
              onClick={previewOnClick}
              variant="outline-primary"
              style={{ cursor: 'pointer' }}
              className="px-2 border-left-2 border-light"
            >
              <CodeBoxButtonWrapper>
                <FaEye /> <SafeFormatMessage id="Preview" />
              </CodeBoxButtonWrapper>
            </div>
          )}
        </div>
      </div>
      <div dir="ltr" style={{ padding: '10px' }}>
        <SyntaxHighlighter language={language}>{codeString}</SyntaxHighlighter>
      </div>
    </CodeBoxWrapper>
  )
}
export default CodeBox
