import React, { useEffect, useState } from 'react'
import { MultiSelect } from 'primereact/multiselect'
import { useIntl } from 'react-intl'
import SafeFormatMessage from '../../SafeFormatMessage/SafeFormatMessage'
import { Form } from '@themesberg/react-bootstrap'
import useSharedFunctions from '../../SharedFunctions/SharedFunctions'

const FilteringMultiSelect = ({
  field,
  optionsArray,
  onSubmit,
  label,
  width,
}) => {
  const [selectedValues, setSelectedValues] = useState()
  useEffect(() => {
    if (optionsArray?.length) {
      const allIds = optionsArray.map((option) => option.id)
      setSelectedValues(allIds) // Select all by default when optionsArray is available
    }
  }, [optionsArray?.length > 0])

  const { getLocalizedString } = useSharedFunctions()
  const intl = useIntl()

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
    const selectedIds = e.value.map((option) => option)
    setSelectedValues(selectedIds)
  }

  return (
    <div
      className="filtering-multi-select mx-2 d-flex flex-column flex-sm-row"
      style={{ position: 'relative' }}
    >
      <span className="mb-0">
        <SafeFormatMessage id={label} />
      </span>

      <MultiSelect
        value={selectedValues}
        options={optionsArray}
        onChange={handleSelectionChange}
        optionLabel={(option) =>
          getLocalizedString(option?.displayNameLocalizations) || (
            <SafeFormatMessage id={option?.label} />
          )
        }
        optionValue="id"
        placeholder={intl.formatMessage({ id: 'Select' })}
        display="chip"
        className={!width ? 'md:w-15rem ' : `md:w-${width}rem`}
      />
    </div>
  )
}

export default FilteringMultiSelect
