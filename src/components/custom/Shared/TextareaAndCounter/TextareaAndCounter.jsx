import React, { useState, useEffect, useRef } from 'react'
import { TextareaCounterWrapper } from './TextareaAndCounter.styled'
import { useSelector } from 'react-redux'

const TextareaAndCounter = ({
  addTextarea,
  maxLength,
  showCharCount,
  inputValue,
  disabled,
  placeholder,
  id,
  name,
  onChange,
  disableMainClass,
  style,
  onDrop,
  onDragOver,
}) => {
  const [characterCount, setCharacterCount] = useState(inputValue?.length)
  const [value, setValue] = useState(inputValue)
  const textareaRef = useRef(null)
  let direction = useSelector((state) => state.main.direction)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleTextareaChange = (e) => {
    e.preventDefault()
    const inputValue = e.target.value
    if (inputValue.length <= maxLength) {
      setCharacterCount(inputValue.length)
      addTextarea && addTextarea('description', inputValue)
      setValue(inputValue)
    }

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <TextareaCounterWrapper direction={direction}>
      <div className="textarea-container">
        <textarea
          className={
            disableMainClass ? 'form-control' : 'textarea-input form-control'
          }
          value={value}
          onChange={handleTextareaChange}
          maxLength={maxLength}
          ref={textareaRef}
          disabled={disabled}
          placeholder={placeholder}
          id={id}
          name={name}
          style={style}
          onDrop={onDrop}
          onDragOver={onDragOver}
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
