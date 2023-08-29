import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import ThemeDialog from '../ThemeDialog/ThemeDialog'
import ProductForm from '../../Product/ProductForm/ProductForm'
import useRequest from '../../../../axios/apis/useRequest'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TenantForm from '../../tenant/TenantForm/TenantForm'
import {
  Dropdown,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Wrapper } from './DynamicButtons.styled'
import PlanForm from '../../Plan/PlanForm/PlanForm'
import FeatureForm from '../../Feature/FeatureForm/FeatureForm'
import FeaturePlanForm from '../../Product/ProductFeaturePlan/FeaturePlanForm/FeaturePlanForm'

const DynamicButtons = ({ buttons }) => {
  const navigate = useNavigate()
  const productsData = useSelector((state) => state.products.products)
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const plansData = useSelector((state) => state.plans.plans)
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
    editPlan: () => (
      <>
        <PlanForm
          popupLabel={<FormattedMessage id="Edit-Plan" />}
          type={'edit'}
          planData={plansData[buttons[currentButtonIndex].id]}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
        />
      </>
    ),
    addFeaturePlan: () => (
      <>
        <FeaturePlanForm
          popupLabel={<FormattedMessage id="Add-Feature-Plan" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
        />
      </>
    ),
    addPlan: () => (
      <>
        <PlanForm
          popupLabel={<FormattedMessage id="Add-Plan" />}
          type={'create'}
          planData={plansData[buttons[currentButtonIndex].id]}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
        />
      </>
    ),
    addFeature: () => (
      <>
        <FeatureForm
          productId={buttons[currentButtonIndex].id}
          popupLabel={<FormattedMessage id="Add-Feature" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
        />

        {/* <FeatureForm
             
               update={update}
              setUpdate={setUpdate}
              //  featureData={type == 'edit' ? list?.features[currentId] : {}}
            /> */}
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
                <OverlayTrigger
                  trigger={['hover']}
                  overlay={
                    <Tooltip>
                      <FormattedMessage id={button.label} />
                    </Tooltip>
                  }
                >
                  <span>
                    <Button
                      key={index}
                      onClick={() => {
                        setConfirm(true)
                        setCurrentButtonIndex(index)
                      }}
                    >
                      {button.icon}
                    </Button>
                  </span>
                </OverlayTrigger>
              )
            } else if (button.type == 'form') {
              return (
                <OverlayTrigger
                  trigger={['hover']}
                  overlay={
                    <Tooltip>
                      <FormattedMessage id={button.label} />
                    </Tooltip>
                  }
                >
                  <span>
                    <Button
                      key={index}
                      onClick={() => {
                        setVisible(true)
                        setCurrentButtonIndex(index)
                      }}
                    >
                      {button.icon}
                    </Button>
                  </span>
                </OverlayTrigger>
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
              {buttons.map((button, index) => {
                if (button.order > 3)
                  if (button.type == 'delete') {
                    return (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          className="redColor"
                          key={index}
                          onClick={() => {
                            setConfirm(true)
                            setCurrentButtonIndex(index)
                          }}
                        >
                          {button.icon} <FormattedMessage id={button.label} />
                        </Dropdown.Item>
                      </>
                    )
                  } else if (button.type == 'form') {
                    return (
                      <>
                        <Dropdown.Item
                          key={index}
                          onClick={() => {
                            setVisible(true)
                            setCurrentButtonIndex(index)
                          }}
                        >
                          {button.icon} <FormattedMessage id={button.label} />
                        </Dropdown.Item>
                      </>
                    )
                  }
              })}
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
