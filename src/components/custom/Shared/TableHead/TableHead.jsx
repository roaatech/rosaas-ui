import React, { useState } from 'react'
import { Wrapper } from './TableHead.styled'
import { Button, ButtonGroup } from '@themesberg/react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { BsSearch } from 'react-icons/bs'
import useGlobal from '../../../../lib/hocks/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ThemeDialog from '../ThemeDialog/ThemeDialog'
import { useIntl } from 'react-intl'

const TableHead = ({
  label,
  setSearchValue,
  children,
  setFirst,
  visibleHead,
  setVisibleHead,
  search = true,
  title,
}) => {
  const { searchWait } = useGlobal()
  const [inputValue, setInputValue] = useState('')
  const intl = useIntl()
  return (
    <Wrapper>
      <div className="px-3 py-4 d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 wrapper">
        <div className="Title">
          <h4 className="m-0">{title}</h4>
        </div>
        <div className="d-flex flex-wrap">
          <div>
            {children && children?.length > 1 ? (
              <div className="p-input-icon-left mt-2 mr-2">{children[1]}</div>
            ) : null}
            {search && (
              <div className={`p-input-icon-left mx-2`}>
                <BsSearch />
                <InputText
                  className="form-control"
                  placeholder={intl.formatMessage({ id: 'Search' })}
                  value={inputValue}
                  onChange={(e) =>
                    searchWait(e, setInputValue, setSearchValue, setFirst)
                  }
                />
              </div>
            )}
          </div>
          {children && (
            <ButtonGroup>
              <Button
                variant="secondary"
                className="addButton"
                onClick={() => setVisibleHead(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-2" />
                {label}
              </Button>
            </ButtonGroup>
          )}
        </div>
      </div>
      <ThemeDialog visible={visibleHead} setVisible={setVisibleHead}>
        {children && children.length > 1 ? children[0] : children}
      </ThemeDialog>
    </Wrapper>
  )
}

export default TableHead
