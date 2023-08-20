import React, { useState, useRef } from 'react'
import { DescriptionCellWrapper } from './DescriptionCell.styled';

const DescriptionCell = ({ data }) => {
  const [showMore, setShowMore] = useState(false);
  const contentRef = useRef(null);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const isLongDescription = data.description.length > 50;

  const maxHeight = showMore
    ? contentRef.current
      ? `${contentRef.current.scrollHeight}px`
      : '1000px'
    : isLongDescription
    ? '25px'
    : 'auto'; // For short descriptions

  return (
    <DescriptionCellWrapper maxheight={maxHeight}>
      <div className="description-cell">
        {isLongDescription ? (
          <div>
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
  );
};


export default DescriptionCell
