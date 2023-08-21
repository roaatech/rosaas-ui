import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import ThemeDialog from '../ThemeDialog/ThemeDialog'
import ProductForm from '../../Product/ProductForm/ProductForm'
import useRequest from '../../../../axios/apis/useRequest'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TenantForm from '../../tenant/TenantForm/TenantForm'
import { Dropdown, Button } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Wrapper } from './DynamicButtons.styled'

const DynamicButtons = ({ buttons }) => {
  const navigate = useNavigate()
  const productsData = useSelector((state) => state.products.products)
  const tenantsData = useSelector((state) => state.tenants.tenants)

  const [confirm, setConfirm] = useState(false)
  const [currentButtonIndex, setCurrentButtonIndex] = useState()
  const [more, setMore] = useState(false)
  const request = useRequest()
  const deleteItem = async () => {
    await request[buttons[currentButtonIndex].request]({
      id: buttons[currentButtonIndex].id,
    })
    navigate(buttons[currentButtonIndex].navAfterDelete)
  }
  /****************************************** */

  const [visible, setVisible] = useState(false)

  const forms = {
    editProduct: () => (
      <ProductForm
        type={'edit'}
        visible={visible}
        productData={productsData[buttons[currentButtonIndex].id]}
        setVisible={setVisible}
        popupLabel={<FormattedMessage id="Edit-Product" />}
      />
    ),
    addTenant: () => (
      <TenantForm
        popupLabel={<FormattedMessage id="Create-Tenant" />}
        type={'create'}
        visible={visible}
        setVisible={setVisible}
        sideBar={true}
      />
    ),
    editTenant: () => (
      <>
        <TenantForm
          popupLabel={<FormattedMessage id="Edit-Tenant" />}
          type={'edit'}
          tenantData={tenantsData[buttons[currentButtonIndex].id]}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          updateTenant={buttons[currentButtonIndex].updateTenant}
        />
      </>
    ),
  }

  return (
    <Wrapper className="d-flex">
      <div className="action">
        {buttons.map((button, index) => {
          if (button.order <= 3) {
            if (button.type == 'delete') {
              return (
                <Button
                  key={index}
                  onClick={() => {
                    setConfirm(true)
                    setCurrentButtonIndex(index)
                  }}
                >
                  <FormattedMessage id={button.label} />
                </Button>
              )
            } else if (button.type == 'form') {
              return (
                <Button
                  key={index}
                  onClick={() => {
                    setVisible(true)
                    setCurrentButtonIndex(index)
                  }}
                >
                  <FormattedMessage id={button.label} />
                </Button>
              )
            }
          } else {
            if (!more) setMore(true)
            return <></>
          }
        })}
      </div>

      {more && (
        <div className="dropdown ml-2">
          <Dropdown>
            <Dropdown.Toggle as={Button} variant="primary">
              More
              <span className="icon icon-small ms-1">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-1">
              {/* <Dropdown.Item>Products</Dropdown.Item>
            <Dropdown.Item>Customers</Dropdown.Item> */}
              {buttons.map((button, index) => {
                if (button.order > 3)
                  if (button.type == 'delete') {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={() => {
                          setConfirm(true)
                          setCurrentButtonIndex(index)
                        }}
                      >
                        <FormattedMessage id={button.label} />
                      </Dropdown.Item>
                    )
                  } else if (button.type == 'form') {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={() => {
                          setVisible(true)
                          setCurrentButtonIndex(index)
                        }}
                      >
                        <FormattedMessage id={button.label} />
                      </Dropdown.Item>
                    )
                  }
              })}

              {/* <Dropdown.Divider /> */}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      <DeleteConfirmation
        message={
          <FormattedMessage
            id={buttons[currentButtonIndex]?.confirmationMessage}
          />
        }
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={deleteItem}
        sideBar={false}
      />

      <ThemeDialog visible={visible} setVisible={setVisible}>
        {currentButtonIndex !== undefined &&
        buttons[currentButtonIndex].type == 'form' ? (
          forms[buttons[currentButtonIndex].component]()
        ) : (
          <></>
        )}
      </ThemeDialog>
    </Wrapper>
  )
}

export default DynamicButtons
