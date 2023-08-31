import React, { useState, useRef } from 'react'
import { DescriptionCellWrapper } from './DescriptionCell.styled'

const DescriptionCell = ({ data, maxWidth = 410 }) => {
  const [showMore, setShowMore] = useState(false);
  const contentRef = useRef(null);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const maxChar =0.15609756097560975609756097560976 * maxWidth;
  const isLongDescription = data.description.length > maxChar;


  const maxHeight = showMore
    ? contentRef.current
      ? `${contentRef.current.scrollHeight}px`
      : '1000px'
    : isLongDescription
    ? '25px'
    : 'auto' // For short descriptions

  return (
    <DescriptionCellWrapper maxheight={maxHeight}>
      <div className="description-cell">
        {isLongDescription ? (
          <div className="d-flex flex-start flex-wrap">
            <div
              ref={contentRef}
              className={`description-text ${showMore ? 'expanded' : ''}`}
            >
              {data.description}
            </div>
            <span className="show-more-link" onClick={toggleShowMore}>
              {showMore ? 'Show Less' : 'Show More'}
            </span>
          </div>
        ) : (
          data.description
        )}
      </div>
    </DescriptionCellWrapper>
  )
}

export default DescriptionCell


