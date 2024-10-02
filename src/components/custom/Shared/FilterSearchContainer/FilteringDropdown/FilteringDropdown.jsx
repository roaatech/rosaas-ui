import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useIntl } from 'react-intl'
import SafeFormatMessage from '../../SafeFormatMessage/SafeFormatMessage'
import { FaFilter } from 'react-icons/fa'
import { Wrapper } from './FilteringDropdown.styled'
import useSharedFunctions from '../../SharedFunctions/SharedFunctions'

const FilteringDropdown = ({
  field,
  optionsArray,
  onSubmit,
  label,
  filter = true,
}) => {
  const { getLocalizedString } = useSharedFunctions()
  const intl = useIntl()
  const [filteredOptions, setFilteredOptions] = useState([])
  const [selectedValue, setSelectedValue] = useState(null)

  const defaultOption = {
    id: null,
    label: intl.formatMessage({ id: 'Select' }),
  }

  useEffect(() => {
    const validOptionsArray = Array.isArray(optionsArray) ? optionsArray : []

    const optionsWithDefault = [defaultOption, ...validOptionsArray]

    setFilteredOptions(optionsWithDefault)
    setSelectedValue(defaultOption.id)
  }, [optionsArray && optionsArray.length])

  const handleFilter = (event) => {
    const filterValue = event.query.trim().toLowerCase()

    const filtered = filteredOptions.filter((option) => {
      const filterLabel =
        getLocalizedString(option?.displayNameLocalizations) ||
        option?.systemName ||
        option?.label

      return filterLabel.toLowerCase().includes(filterValue)
    })

    setFilteredOptions(filtered)
  }

  useEffect(() => {
    // Submit data only if a valid option is selected (not the default)
    const formattedData =
      selectedValue !== null
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
          options={filteredOptions}
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
        />
      </div>
    </Wrapper>
  )
}

export default FilteringDropdown
