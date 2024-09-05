import React from 'react'
import { Wrapper } from './DataLabelPrice.styled'
import { formatDate } from '../../../../lib/sharedFun/Time'
 


const DataLabelPrice = ({ price, oldPrice }) => {
  return (
    <Wrapper>
      {oldPrice ? (<span className="old-price-label price-label"  >{oldPrice}</span>  ) : (<span className=""  > </span>  ) 
          }
      <span className="price-label" >{price}</span>
    </Wrapper>
  )
}

export default DataLabelPrice
