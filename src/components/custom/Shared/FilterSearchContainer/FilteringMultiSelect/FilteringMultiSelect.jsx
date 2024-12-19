import React, { useEffect, useState } from 'react'
import { MultiSelect } from 'primereact/multiselect'
import { useIntl } from 'react-intl'
import SafeFormatMessage from '../../SafeFormatMessage/SafeFormatMessage'
import { Form } from '@themesberg/react-bootstrap'
import useSharedFunctions from '../../SharedFunctions/SharedFunctions'
import { isMatch } from 'lodash'
import { FaFilter } from 'react-icons/fa'
import { MdSelectAll } from 'react-icons/md'

const FilteringMultiSelect = ({
  field,
  optionsArray,
  onSubmit,
  label,
  clearSelection = false,
  hasSelectAll,
}) => {
  const [selectedValues, setSelectedValues] = useState()

  useEffect(() => {
    if (clearSelection) {
      setSelectedValues([]) // Clear selection if clearSelection is true
    } else if (optionsArray?.length) {
      const allIds = optionsArray?.map((option) => option?.id)
      setSelectedValues(allIds) // Default to all selected
    }
  }, [optionsArray?.length, clearSelection])

  const { getLocalizedString } = useSharedFunctions()
  const intl = useIntl()
  const [filteredOptions, setFilteredOptions] = useState()

  useEffect(() => {
    setFilteredOptions(optionsArray)
  }, [optionsArray])
  const handleFilter = (event) => {
    const filterValue = event.filter.trim().toLowerCase()

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
    if (selectedValues?.length === optionsArray?.length) {
      onSubmit([])
      return
    }

    const formattedData =
      selectedValues &&
      selectedValues?.map((value) => ({
        field,
        value,
      }))

    onSubmit(formattedData)
  }, [selectedValues?.length])

  const handleSelectionChange = (e) => {
    const selectedIds = e.value?.map((option) => option)
    setSelectedValues(selectedIds)
  }
  const panelHeaderTemplate = (options) => {
    const { className, checkboxElement, isAllSelected } = options

    return (
      <div className={className} style={{ padding: '8px 12px' }}>
        <div className="p-multiselect-header-checkbox">
          {React.cloneElement(checkboxElement, {
            checked: selectedValues?.length === optionsArray?.length,
          })}
          <span>
            {' '}
            <SafeFormatMessage id="SelectAll" />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="filtering-multi-select mx-2 d-flex flex-column ">
      <span className="mb-0">
        <SafeFormatMessage id={label} />
      </span>

      <MultiSelect
        value={selectedValues}
        options={filteredOptions ? Object.values(filteredOptions) : []}
        onChange={handleSelectionChange}
        optionLabel={(option) =>
          option.label ||
          getLocalizedString(option?.displayNameLocalizations) ||
          option?.systemName
        }
        showSelectAll={true}
        filter={(option) => (option?.label ? true : false)}
        onFilter={handleFilter}
        optionValue="id"
        placeholder={SafeFormatMessage({ id: 'Select' })}
        dropdownIcon={FaFilter}
        itemCheckboxIcon={MdSelectAll}
        panelHeaderTemplate={hasSelectAll && panelHeaderTemplate}
        maxSelectedLabels={0}
        selectedItemTemplate={(items) => {
          const count = selectedValues?.length
          return count === 0 ? (
            SafeFormatMessage({ id: 'No-items-selected' })
          ) : (
            <span>
              {count} <SafeFormatMessage id={'items-selected'} />
            </span>
          )
        }}
      />
    </div>
  )
}

export default FilteringMultiSelect
