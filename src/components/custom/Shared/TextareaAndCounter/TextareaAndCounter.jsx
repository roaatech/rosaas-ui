import React, { useState, useEffect, useRef } from 'react'
import { TextareaCounterWrapper } from './TextareaAndCounter.styled'

const TextareaAndCounter = ({
  addTextarea,
  maxLength,
  showCharCount,
  inputValue,
}) => {
  const [characterCount, setCharacterCount] = useState(inputValue?.length || 0)
  const [value, setValue] = useState(inputValue)
  const [numRows, setNumRows] = useState(1)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      const newNumRows = Math.ceil(textareaRef.current.scrollHeight / 25)
      setNumRows(newNumRows)
    }
  }, [value])

  const handleTextareaChange = (e) => {
    const inputValue = e.target.value
    if (inputValue.length <= maxLength) {
      setCharacterCount(inputValue.length)
      setValue(inputValue)
      addTextarea('description', inputValue)
    }
  }

  const textareaStyle = {
    height: `${numRows * 25}px`,
  }

  return (
    <TextareaCounterWrapper>
      <div className="textarea-container">
        <textarea
          className="form-control"
          style={textareaStyle}
          value={value}
          onChange={handleTextareaChange}
          maxLength={maxLength}
          ref={textareaRef}
        />

        {showCharCount && (
          <div className="char-counter">
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    </TextareaCounterWrapper>
  )
}

export default TextareaAndCounter
