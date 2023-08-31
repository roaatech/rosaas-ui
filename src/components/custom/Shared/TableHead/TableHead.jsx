import React, { useState } from 'react'
import { Wrapper } from './TableHead.styled'
import {
  Button,
  ButtonGroup,
  InputGroup,
  Col,
  Row,
  Form,
  Card,
  Breadcrumb,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { BsSearch } from 'react-icons/bs'
import { Dialog } from 'primereact/dialog'
import useGlobal from '../../../../lib/hocks/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '@themesberg/react-bootstrap'
import ThemeDialog from '../ThemeDialog/ThemeDialog'
import { FormattedMessage, useIntl } from 'react-intl'

const TableHead = ({
  label,
  name,
  icon,
  setSearchValue,
  children,
  setFirst,
  visibleHead,
  setVisibleHead,
  search = true,
  fullWidth = false,
}) => {
  const { searchWait } = useGlobal()
  const [inputValue, setInputValue] = useState('')
  const intl = useIntl()
  return (
    <Wrapper>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 wrapper">
        <ButtonGroup className={fullWidth && 'w-100'}>
          <Button variant="secondary" onClick={() => setVisibleHead(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {label}
          </Button>
        </ButtonGroup>

        <div className={fullWidth && 'w-100'}>
          {children.length > 1 ? (
            <div className="p-input-icon-left mt-2 mr-2">{children[1]}</div>
          ) : null}
          {search && (
            <div className={`${fullWidth && 'w-100'} p-input-icon-left mt-2`}>
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
      </div>

      <ThemeDialog visible={visibleHead} setVisible={setVisibleHead}>
        {children.length > 1 ? children[0] : children}
      </ThemeDialog>
    </Wrapper>
  )
}

export default TableHead
