import React, { useState } from 'react'
import { Wrapper } from './QuickActions.styled'
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
import { BsBoxSeam, BsFillPersonFill, BsSearch } from 'react-icons/bs'
import { Dialog } from 'primereact/dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisH,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { Modal } from '@themesberg/react-bootstrap'

import { FormattedMessage, useIntl } from 'react-intl'
import useGlobal from '../../../lib/hocks/global'
import ThemeDialog from '../../custom/Shared/ThemeDialog/ThemeDialog'
import TenantForm from '../../custom/tenant/TenantForm/TenantForm'
import ProductForm from '../../custom/Product/ProductForm/ProductForm'

const QuickAction = ({
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
  const [visibleTenant, setVisibleTenant] = useState(false)
  const [visibleProduct, setVisibleProduct] = useState(false)
  const inputHeight = '56px'
  return (
    <Wrapper>
      <div className="d-flex  py-4 wrapper">
        <div className=" d-flex align-items-center quick-actions">
          {/* <ButtonGroup className={fullWidth && 'w-100'}>
          <Button variant="secondary" onClick={() => setVisibleHead(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {label}
          </Button>
          </ButtonGroup> */}
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              as={Button}
              variant="secondary"
              className={fullWidth && 'text-dark m-0 p-0'}
            >
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faPlus} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onSelect={() => setVisibleTenant(true)}
                className="text-dark"
              >
                <span className="me-2 ">
                  <BsFillPersonFill />{' '}
                </span>
                <FormattedMessage id="Add-Tenant" />
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => setVisibleProduct(true)}
                className="text-dark"
              >
                <span className="me-2 ">
                  <BsBoxSeam />{' '}
                </span>
                {/* <FontAwesomeIcon icon={BsBoxSeam} className="me-2" /> */}
                <FormattedMessage id="Add-Product" />
              </Dropdown.Item>

              {/* <Dropdown.Item
              onClick={() => deleteConfirm(id)}
              className="text-danger"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
              <FormattedMessage id="Delete" />
            </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
          {visibleTenant && (
            <ThemeDialog visible={visibleTenant} setVisible={setVisibleTenant}>
              <TenantForm
                popupLabel={<FormattedMessage id="Create-Tenant" />}
                type={'create'}
                visible={visibleTenant}
                setVisible={setVisibleTenant}
              />
            </ThemeDialog>
          )}
          {visibleProduct && (
            <ThemeDialog
              visible={visibleProduct}
              setVisible={setVisibleProduct}
            >
              <ProductForm
                popupLabel={<FormattedMessage id="Create-Product" />}
                type={'create'}
                visible={visibleProduct}
                setVisible={setVisibleProduct}
                sideBar={true}
              />
            </ThemeDialog>
          )}

          <div className={'search-input ms-2 '}>
            {/* {children.length > 1 ? (
            <div className="p-input-icon-left mt-2 mr-2">{children[1]}</div>
          ) : null} */}
            {search && (
              <div
                className={`input-text-container ${
                  fullWidth ? 'w-100' : ''
                } p-input-icon-left mt-2 `}
              >
                <BsSearch className="search-icon" />
                <InputText
                  className="form-control border-0"
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
      </div>

      {/* <ThemeDialog visible={visibleHead} setVisible={setVisibleHead}>
        {children.length > 1 ? children[0] : children}
      </ThemeDialog> */}
    </Wrapper>
  )
}

export default QuickAction
