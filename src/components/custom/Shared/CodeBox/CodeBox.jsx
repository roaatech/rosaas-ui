import { useState } from 'react'
import { FaCopy } from 'react-icons/fa'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styled from 'styled-components'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'

const CodeBoxWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 1rem;
  background-color: var(--primary0);
`

const CodeBox = ({ codeString, language }) => {
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
        <div
          onClick={handleCopy}
          variant="outline-primary"
          style={{ cursor: 'pointer' }}
        >
          <FaCopy className="mx-2" />
          {toolTipText}
        </div>
      </div>
      <div style={{ padding: '10px' }}>
        <SyntaxHighlighter language={language}>{codeString}</SyntaxHighlighter>
      </div>
    </CodeBoxWrapper>
  )
}
export default CodeBox
