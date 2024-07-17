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
import {
  BsBoxSeam,
  BsFillPersonFill,
  BsFillPersonPlusFill,
  BsSearch,
} from 'react-icons/bs'
import { Dialog } from 'primereact/dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '@themesberg/react-bootstrap'

import { FormattedMessage, useIntl } from 'react-intl'
import useGlobal from '../../../lib/hocks/global'
import ThemeDialog from '../../custom/Shared/ThemeDialog/ThemeDialog'
import TenantForm from '../../custom/tenant/TenantForm/TenantForm'
import ProductForm from '../../custom/Product/ProductForm/ProductForm'
import { useSelector } from 'react-redux'
import TenantFormOnboarding from '../../custom/tenant/TenantFormOnboarding/TenantFormOnboarding'
import { MdBusiness } from 'react-icons/md'
import ProductOwnerForm from '../../custom/ProductOwner/ProductOwnerForm'

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
  const [visibleTenantAndPay, setVisibleTenantAndPay] = useState(false)
  const [visibleProduct, setVisibleProduct] = useState(false)
  const [visiblePO, setVisiblePO] = useState(false)
  console.log({ visiblePO })
  const inputHeight = '56px'
  let userRole = useSelector((state) => state.auth.userInfo.userType)
  return (
    <Wrapper>
      <div className="d-flex  py-4 wrapper">
        <div className=" d-flex align-items-center quick-actions">
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
          {/* <ButtonGroup className={fullWidth && 'w-100'}>
          <Button variant="secondary" onClick={() => setVisibleHead(true)}>
            <FontAwesomeIcon icon={faPlus} className="mx-2" />
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
                <FontAwesomeIcon
                  icon={faPlus}
                  className="icon-dark main-icon"
                />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu">
              {/* <Dropdown.Item
                onSelect={() => setVisibleTenant(true)}
                className="text-dark"
              >
                <span className="mx-2 ">
                  <BsFillPersonPlusFill className="product-icon" />
                </span>
                <FormattedMessage id="Add-Tenant" />
              </Dropdown.Item> */}

              <Dropdown.Item
                onSelect={() => setVisibleTenantAndPay(true)}
                className="text-dark"
              >
                <span className="mx-2 ">
                  <BsFillPersonPlusFill className="product-icon" />
                  {/* <FontAwesomeIcon icon={faPlus} className="plus icon-dark" /> */}
                </span>
                <FormattedMessage id="Add-Tenant" />
              </Dropdown.Item>

              {(userRole == 'productOwner' ||
                userRole == 'superAdmin' ||
                userRole == 'clientAdmin') && (
                <Dropdown.Item
                  onSelect={() => setVisibleProduct(true)}
                  className="text-dark"
                >
                  <span className=" mx-2 ">
                    <BsBoxSeam className="product-icon" />
                    <FontAwesomeIcon icon={faPlus} className="plus icon-dark" />
                  </span>
                  <FormattedMessage id="Add-Product" />
                </Dropdown.Item>
              )}
              {(userRole == 'superAdmin' || userRole == 'clientAdmin') && (
                <Dropdown.Item
                  onSelect={() => setVisiblePO(true)}
                  className="text-dark"
                >
                  <span className=" mx-2 ">
                    <MdBusiness className="product-icon" />
                    <FontAwesomeIcon icon={faPlus} className="plus icon-dark" />
                  </span>
                  <FormattedMessage id="Add-Product-Owner" />
                </Dropdown.Item>
              )}
              {/* <Dropdown.Item
              onClick={() => deleteConfirm(id)}
              className="text-danger"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
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
          {visiblePO && (
            <ThemeDialog visible={visiblePO} setVisible={setVisiblePO}>
              <ProductOwnerForm
                popupLabel={<FormattedMessage id="Create-Product-Owner" />}
                type={'create'}
                visible={visiblePO}
                setVisible={setVisiblePO}
              />
            </ThemeDialog>
          )}
          {visibleTenantAndPay && (
            <ThemeDialog
              visible={visibleTenantAndPay}
              setVisible={setVisibleTenantAndPay}
            >
              <TenantFormOnboarding
                popupLabel={<FormattedMessage id="Tenant-Onboard" />}
                type={'create'}
                visible={visibleTenantAndPay}
                setVisible={setVisibleTenantAndPay}
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
        </div>
      </div>

      {/* <ThemeDialog visible={visibleHead} setVisible={setVisibleHead}>
        {children.length > 1 ? children[0] : children}
      </ThemeDialog> */}
    </Wrapper>
  )
}

export default QuickAction
