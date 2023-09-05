import React, { useState, useEffect, useRef } from 'react'
import { TextareaCounterWrapper } from './TextareaAndCounter.styled'

const TextareaAndCounter = ({
  addTextarea,
  maxLength,
  showCharCount,
  inputValue,
  disabled,
}) => {
  const [characterCount, setCharacterCount] = useState(inputValue?.length || 0)
  const [value, setValue] = useState(inputValue)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
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

  return (
    <TextareaCounterWrapper>
      <div className="textarea-container">
        <textarea
          className="form-control"
          value={value}
          onChange={handleTextareaChange}
          maxLength={maxLength}
          ref={textareaRef}
          disabled={disabled}
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
