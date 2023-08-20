import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import ThemeDialog from '../ThemeDialog/ThemeDialog'
import ProductForm from '../../Product/ProductForm/ProductForm'
import useRequest from '../../../../axios/apis/useRequest'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TenantForm from '../../tenant/TenantForm/TenantForm'

const DynamicButtons = ({ buttons }) => {
  const navigate = useNavigate()
  const productsData = useSelector((state) => state.products.products)
  const tenantsData = useSelector((state) => state.tenants.tenants)

  const [confirm, setConfirm] = useState(false)
  const [currentButtonIndex, setCurrentButtonIndex] = useState()
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
    <div>
      <div className="action">
        {buttons.map((button, index) => {
          if (button.type == 'delete') {
            return (
              <Button
                key={index}
                label={<FormattedMessage id={button.label} />}
                onClick={() => {
                  setConfirm(true)
                  setCurrentButtonIndex(index)
                }}
              />
            )
          } else if (button.type == 'form') {
            return (
              <Button
                key={index}
                label={<FormattedMessage id={button.label} />}
                onClick={() => {
                  setVisible(true)
                  setCurrentButtonIndex(index)
                }}
              />
            )
          }
        })}
      </div>
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
    </div>
  )
}

export default DynamicButtons
