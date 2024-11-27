import React from 'react'
import { InputText } from 'primereact/inputtext'
import { BsSearch } from 'react-icons/bs'

import { useIntl } from 'react-intl'
const SearchBar = ({ inputValue, setInputValue }) => {
  const intl = useIntl()

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="d-flex align-items-center">
      <div className="p-input-icon-left mx-2">
        <BsSearch />
        <InputText
          className="form-control"
          placeholder={intl.formatMessage({ id: 'Search' })}
          value={inputValue}
          onChange={handleInputChange} // Update value in parent
        />
      </div>
    </div>
  )
}

export default SearchBar
