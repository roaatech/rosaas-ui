import React, { useState } from 'react'
import { TextareaCounterWrapper } from './TextareaAndCounter.styled'

const TextareaAndCounter = ({
  value,
  onValueChange,
  maxLength,
  showCharCount,
}) => {
  const [characterCount, setCharacterCount] = useState(value.length)

  const handleTextareaChange = (e) => {
    const inputValue = e.target.value
    if (inputValue.length <= maxLength) {
      setCharacterCount(inputValue.length)
      onValueChange(inputValue)
    }
  }

  return (
    <TextareaCounterWrapper>
      <div className="textarea-container">
        <textarea
          className="form-control"
          rows={Math.ceil(value.length / 63)}
          value={value}
          onChange={handleTextareaChange}
          maxLength={maxLength}
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