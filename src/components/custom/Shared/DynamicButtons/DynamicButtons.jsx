import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import ThemeDialog from '../ThemeDialog/ThemeDialog'
import ProductForm from '../../Product/ProductForm/ProductForm'
import useRequest from '../../../../axios/apis/useRequest'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const DynamicButtons = ({ buttons }) => {
  const navigate = useNavigate()
  const productsData = useSelector((state) => state.products.products)

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

  // const forms = {
  //   editProduct: () => (
  //     <ProductForm
  //       type={'edit'}
  //       visible={visible}
  //       productData={productsData[buttons[currentButtonIndex].id]}
  //       setVisible={setVisible}
  //       popupLabel={<FormattedMessage id="Edit-Product" />}
  //     />
  //   ),
  // }

  return (
    <div>
      <div className="action">
        {buttons.map((button, index) => {
          if (button.type == 'delete') {
            return (
              <Button
                label={<FormattedMessage id={button.label} />}
                onClick={() => {
                  setConfirm(true)
                  setCurrentButtonIndex(index)
                }}
              />
            )
          } else if (button.type == 'edit') {
            return (
              <Button
                label={<FormattedMessage id={button.label} />}
                onClick={() => {
                  setVisible(true)
                  setCurrentButtonIndex(index)
                }}
              />
              // <></>
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
        {/* {currentButtonIndex && buttons[currentButtonIndex].type == 'form'
          ? forms[buttons[currentButtonIndex].component]
          : null} */}
      </ThemeDialog>
    </div>
  )
}

export default DynamicButtons
