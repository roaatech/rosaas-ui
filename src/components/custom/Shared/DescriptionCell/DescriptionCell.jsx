import React, { useState, useRef, useEffect } from 'react'
import { DescriptionCellWrapper } from './DescriptionCell.styled'

const DescriptionCell = ({ data }) => {
  const [showMore, setShowMore] = useState(false)
  const contentRef = useRef(null)
  const [maxHeight, setMaxHeight] = useState('auto')

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  useEffect(() => {
    if (contentRef.current) {
      const textHeight = contentRef.current.scrollHeight
      setMaxHeight(
        showMore ? `${textHeight}px` : textHeight > 25 ? '25px' : 'auto'
      )
    }
  }, [showMore])

  return (
    <DescriptionCellWrapper maxheight={maxHeight}>
      <div className="description-cell">
        <div
          className={`description-text ${showMore ? 'expanded' : ''}`}
          ref={contentRef}
        >
          {data.description}
        </div>
        {maxHeight !== 'auto' && (
          <span className="show-more-link" onClick={toggleShowMore}>
            {showMore ? 'Show Less' : 'Show More'}
          </span>
        )}
      </div>
    </DescriptionCellWrapper>
  )
}

export default DescriptionCell
