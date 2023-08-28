import React from 'react'
import { Paginator } from 'primereact/paginator'
import { Wrapper } from './CustomPaginator.styled'

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
  return (
    <Wrapper>
      <span>{`${first + 1}-${displayLastIndex} of ${totalCount}`}</span>
      <Paginator
        size={'small'}
        first={first}
        rows={rows}
        totalRecords={totalCount}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={onPageChange}

        // rowsPerPageOptions = ,
      />
    </Wrapper>
  )
}

export default CustomPaginator
