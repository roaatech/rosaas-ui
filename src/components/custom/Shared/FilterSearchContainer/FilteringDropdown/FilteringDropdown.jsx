import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useIntl } from 'react-intl'
import SafeFormatMessage from '../../SafeFormatMessage/SafeFormatMessage'
import { Form } from '@themesberg/react-bootstrap'
import useSharedFunctions from '../../SharedFunctions/SharedFunctions'
import { FaFilter } from 'react-icons/fa'
import { Wrapper } from './FilteringDropdown.styled'
import { tr } from 'date-fns/locale'

const FilteringDropdown = ({
  field,
  optionsArray,
  onSubmit,
  label,
  filter = true,
}) => {
  const [selectedValue, setSelectedValue] = useState()

  const { getLocalizedString } = useSharedFunctions()
  const intl = useIntl()
  const [filteredOptions, setFilteredOptions] = useState()

  useEffect(() => {
    setFilteredOptions(optionsArray)
  }, [optionsArray])

  const handleFilter = (event) => {
    const filterValue = event.query.trim().toLowerCase()

    const filtered =
      optionsArray &&
      optionsArray.filter((option) => {
        const filterLabel =
          getLocalizedString(option?.displayNameLocalizations) ||
          option?.systemName ||
          option?.label

        return filterLabel.toLowerCase().includes(filterValue)
      })

    setFilteredOptions(filtered)
  }

  useEffect(() => {
    const formattedData = selectedValue
      ? [
          {
            field,
            value: selectedValue,
          },
        ]
      : []

    onSubmit(formattedData)
  }, [selectedValue])

  const handleSelectionChange = (e) => {
    const selectedId = e.value
    setSelectedValue(selectedId)
  }

  return (
    <Wrapper>
      <div className="filtering-dropdown mx-2 d-flex flex-column">
        <span className="mb-0">
          <SafeFormatMessage id={label} />
        </span>

        <Dropdown
          value={selectedValue}
          options={filteredOptions ? Object.values(filteredOptions) : []}
          onChange={handleSelectionChange}
          optionLabel={(option) =>
            option.label ||
            getLocalizedString(option?.displayNameLocalizations) ||
            option?.systemName
          }
          filter={filter}
          onFilter={handleFilter}
          optionValue="id"
          placeholder={SafeFormatMessage({ id: 'Select' })}
          dropdownIcon={FaFilter}
          style={
            {
              // height: '50px',
            }
          }
        />
      </div>
    </Wrapper>
  )
}

export default FilteringDropdown
