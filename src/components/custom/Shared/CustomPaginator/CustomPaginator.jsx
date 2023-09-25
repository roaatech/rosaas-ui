import React from 'react'
import { Paginator } from 'primereact/paginator'
import { Wrapper } from './CustomPaginator.styled'
import { useSelector } from 'react-redux'

const CustomPaginator = ({
  first,
  rows,
  totalCount,
  onPageChange,
  rowsPerPageOptions = [10, 20, 30],
}) => {
  const lastItemIndex = first + rows
  const displayLastIndex =
    lastItemIndex > totalCount ? totalCount : lastItemIndex
  let direction = useSelector((state) => state.main.direction)
  let pageDisplayText = `${
    displayLastIndex > 0 ? first + 1 : 0
  }-${displayLastIndex} / ${totalCount}`

  return (
    <Wrapper>
      <span
        style={{
          direction: direction === 'rtl' ? 'ltr' : 'rtl',
        }}
      >
        {pageDisplayText}
      </span>
      <Paginator
        size={'small'}
        first={first}
        rows={rows}
        totalRecords={totalCount}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={onPageChange}
      />
    </Wrapper>
  )
}

export default CustomPaginator
