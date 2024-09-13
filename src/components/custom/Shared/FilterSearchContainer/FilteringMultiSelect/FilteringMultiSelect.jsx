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
  width,
  setSearchField,
}) => {
  const [selectedValues, setSelectedValues] = useState()

  useEffect(() => {
    if (optionsArray?.length) {
      const allIds = optionsArray?.map((option) => option?.id)
      setSelectedValues(allIds)
    }
  }, [optionsArray?.length > 0])

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
        const label =
          getLocalizedString(option?.displayNameLocalizations) ||
          option?.systemName ||
          option?.label

        return label.toLowerCase().includes(filterValue)
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
          <label style={{ marginLeft: '8px' }}>
            <SafeFormatMessage id="SelectAll" />
          </label>
        </div>
      </div>
    )
  }
  const valueTemplate = (selectedItems) => {
    if (selectedItems && selectedItems.length === optionsArray.length) {
      return <span>All selected</span>
    } else if (selectedItems && selectedItems.length > 0) {
      if (selectedItems.length <= 3) {
        // Display individual labels for 3 or fewer items
        return selectedItems.map((item, index) => (
          <span key={item}>
            {index > 0 && ', '}
            {filteredOptions.find((option) => option.id === item)?.label}
          </span>
        ))
      } else {
        // Display the number of selected items for more than 3 items
        return <span>{selectedItems.length} items selected</span>
      }
    } else {
      return <span>{intl.formatMessage({ id: 'Select' })}</span>
    }
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
        selectAllLabel={<SafeFormatMessage id="SelectAll" />}
        filter={(option) => (option?.label ? true : false)}
        onFilter={handleFilter} // Attach custom filter handler
        optionValue="id"
        placeholder={SafeFormatMessage({ id: 'Select' })}
        display="chip"
        className={!width ? 'md:w-15rem ' : `md:w-${width}rem`}
        // panelHeaderTemplate={panelHeaderTemplate}
        dropdownIcon={FaFilter}
        itemCheckboxIcon={MdSelectAll}
      />
    </div>
  )
}

export default FilteringMultiSelect
