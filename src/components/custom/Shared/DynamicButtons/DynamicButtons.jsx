import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
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
import {
  faChevronDown,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons'
import { Wrapper } from './DynamicButtons.styled'
import FeatureForm from '../../Product/ProductFeaturesList/FeatureForm/FeatureForm'
import FeaturePlanForm from '../../Product/ProductFeaturePlan/FeaturePlanForm/FeaturePlanForm'
import PlanForm from '../../Product/ProductPlansList/PlanForm/PlanForm'
import PlanPriceForm from '../../Product/ProductPlansPrice/PlanPriceForm/PlanPriceForm'
import CustomSpecificationForm from '../../Product/CustomSpecification/CustomSpecificationForm/CustomSpecificationForm'
import TenantSpecificationForm from '../../tenant/TenantSpecificatifonForm/TenantSpecificationForm'
import UpDowngradeForm from '../../tenant/SubscriptionManagement/UpgradeForm/UpDowngradeForm'
import CreateClientForm from '../../Product/ClientCredentials/CreateClientForm/CreateClientForm'
import CreateTenantUserForm from '../../tenant/TenantsUsersManagement/CreateTenantUserForm/CreateTenantUserForm'
import CreateProductUserForm from '../../Product/ProductsUsersManagement/CreateProductUserForm/CreateProductUserForm'
import TrialForm from '../../Product/TrialForm/TrialForm'
import CreateSecretForm from '../../Product/ClientCredentials/SecretMangements/CreateSecretForm/CreateSecretForm'
import CardSaveFormWithStripe from '../../CardSaveForm/CardSaveForm'
import ChangePasswordForm from '../../DashboardTenant/Profile/ChangePasswordForm/ChangePasswordForm'
import CreateWebhookForm from '../../Product/WebhookList/WebhookForm/WebhookForm'
import ProductOwnerForm from '../../ProductOwner/ProductOwnerForm'
import DiscountForm from '../../Discounts/DiscountForm/DiscountForm'
import AddValidationUrlForm from '../../Product/CustomSpecification/AddValidationUrlForm/AddValidationUrlForm'
import CancelSubscriptionForm from '../../tenant/CancelSubscriptionForm/CancelSubscriptionForm'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'
import TemplateForm from '../../Product/TemplateForm/TemplateForm'

const DynamicButtons = ({ buttons }) => {
  const { getTenant } = useRequest()
  const navigate = useNavigate()
  const productsData = useSelector((state) => state.products.products)
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const productOwnersData = useSelector(
    (state) => state.productsOwners.productsOwners
  )
  let direction = useSelector((state) => state.main.direction)

  const [confirm, setConfirm] = useState(false)
  const [currentButtonIndex, setCurrentButtonIndex] = useState()
  const [more, setMore] = useState(false)
  const [visible, setVisible] = useState(false)

  const [toggleStates, setToggleStates] = useState(
    buttons.reduce((acc, button, index) => {
      if (button.type === 'toggle') {
        acc[button.group] = acc[button.group] || {}
        acc[button.group][index] = button.toggleValue
      }
      return acc
    }, {})
  )

  const request = useRequest()

  const deleteItem = async () => {
    buttons[currentButtonIndex].request()
    navigate(buttons[currentButtonIndex].navAfterDelete)
  }

  useEffect(() => {
    const checkMoreArray = buttons?.map((button) => button.order > 3)
    setMore(checkMoreArray.includes(true))
  }, [buttons])
  const handleToggle = (index, group) => {
    setToggleStates((prevState) => {
      const isActive = prevState[group][index]

      if (isActive) return prevState

      return {
        ...prevState,
        [group]: {
          ...Object.keys(prevState[group]).reduce((acc, key) => {
            acc[key] = false
            return acc
          }, {}),
          [index]: true,
        },
      }
    })

    if (!toggleStates[group][index]) {
      buttons[index].toggleFunc()
    }
  }

  const forms = {
    editProduct: () => (
      <ProductForm
        type={'edit'}
        visible={visible}
        productData={productsData[buttons[currentButtonIndex].id]}
        setVisible={setVisible}
        popupLabel={<SafeFormatMessage id="Edit-Product" />}
      />
    ),
    templateForm: () => (
      <TemplateForm
        visible={visible}
        productId={buttons[currentButtonIndex]?.id}
        setVisible={setVisible}
        popupLabel={<SafeFormatMessage id="Edit-Template" />}
      />
    ),
    addTenant: () => (
      <TenantForm
        popupLabel={<SafeFormatMessage id="Create-Tenant" />}
        type={'create'}
        visible={visible}
        setVisible={setVisible}
        sideBar={true}
      />
    ),

    editTenant: () => (
      <TenantForm
        popupLabel={<SafeFormatMessage id="Edit-Tenant" />}
        type={'edit'}
        tenantData={tenantsData[buttons[currentButtonIndex].id]}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        updateTenant={buttons[currentButtonIndex].updateTenant}
      />
    ),
    editTenantSpecification: () => (
      <TenantSpecificationForm
        popupLabel={<SafeFormatMessage id="Edit-Specification" />}
        type={'edit'}
        tenantData={tenantsData[buttons[currentButtonIndex].id]}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        updateTenant={buttons[currentButtonIndex].updateTenant}
        selectedProduct={buttons[currentButtonIndex].selectedProduct}
      />
    ),
    upDowngradeSubscription: () => (
      <UpDowngradeForm
        popupLabel={
          <SafeFormatMessage id={buttons[currentButtonIndex]?.label} />
        }
        tenantData={tenantsData[buttons[currentButtonIndex].id]}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        update={buttons[currentButtonIndex].update}
        setUpdate={buttons[currentButtonIndex].setUpdate}
        selectedProduct={buttons[currentButtonIndex].selectedProduct}
        type={buttons[currentButtonIndex].formType}
        currentOrderId={buttons[currentButtonIndex].currentOrderId}
      />
    ),
    addFeaturePlan: () => (
      <FeaturePlanForm
        popupLabel={<SafeFormatMessage id="Add-Plan-Feature" />}
        type={'create'}
        visible={visible}
        selectedLanguage={buttons[currentButtonIndex].selectedLanguage}
        setVisible={setVisible}
        sideBar={false}
        setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
      />
    ),
    editProductOwner: () => (
      <ProductOwnerForm
        popupLabel={<SafeFormatMessage id="Edit-Product-Owner" />}
        type={'edit'}
        productOwnerData={
          productOwnersData && productOwnersData[buttons[currentButtonIndex].id]
        }
        update={buttons[currentButtonIndex].update}
        setUpdate={buttons[currentButtonIndex].setUpdate}
        visible={visible}
        setVisible={setVisible}
      />
    ),
    addPlan: () => (
      <PlanForm
        popupLabel={<SafeFormatMessage id="Add-Plan" />}
        type={'create'}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
      />
    ),
    addEndpoint: () => (
      <CreateWebhookForm
        visible={visible}
        setVisible={setVisible}
        popUpLable={<SafeFormatMessage id="Add-Endpoint" />}
        webhookId={buttons[currentButtonIndex].currentId}
        type={buttons[currentButtonIndex].formType}
      />
    ),
    addTrial: () => (
      <TrialForm
        popupLabel={<SafeFormatMessage id="Trial-Period" />}
        type={'create'}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
      />
    ),
    addCard: () => (
      <CardSaveFormWithStripe
        popupLabel={<SafeFormatMessage id="Add-Card" />}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        setCards={buttons[currentButtonIndex].setCards}
        cards={buttons[currentButtonIndex].cards}
      />
    ),
    addSpecification: () => (
      <CustomSpecificationForm
        popupLabel={<SafeFormatMessage id="Add-Custom-Specification" />}
        type={'create'}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
      />
    ),
    addPlanPrice: () => (
      <PlanPriceForm
        popupLabel={<SafeFormatMessage id="Add-Plan-Price" />}
        type={'create'}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
      />
    ),
    subscriptionActionsForm: () => (
      <CancelSubscriptionForm
        popupLabel={buttons[currentButtonIndex].popupLabel}
        setVisible={setVisible}
        updateTenant={buttons[currentButtonIndex].updateTenant}
        type={buttons[currentButtonIndex].formType}
      />
    ),

    addFeature: () => (
      <FeatureForm
        popupLabel={<SafeFormatMessage id="Add-Feature" />}
        type={'create'}
        visible={visible}
        setVisible={setVisible}
        sideBar={false}
        setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
      />
    ),
    createSecret: () => (
      <CreateSecretForm
        popupLabel={buttons[currentButtonIndex].popupLabel}
        type={buttons[currentButtonIndex].formType}
        setVisible={setVisible}
        clientId={buttons[currentButtonIndex].clientId}
        update={buttons[currentButtonIndex].update}
        setUpdate={buttons[currentButtonIndex].setUpdate}
      />
    ),
    changePassword: () => (
      <ChangePasswordForm
        popupLabel={buttons[currentButtonIndex].label}
        setVisible={setVisible}
      />
    ),
    createTenantUser: () => (
      <CreateTenantUserForm
        popupLabel={buttons[currentButtonIndex].popupLabel}
        currentUser={buttons[currentButtonIndex].currentUser}
        type={buttons[currentButtonIndex].formType}
        setVisible={setVisible}
        clientId={buttons[currentButtonIndex].clientId}
        update={buttons[currentButtonIndex].update}
        setUpdate={buttons[currentButtonIndex].setUpdate}
      />
    ),
    createProductUser: () => (
      <CreateProductUserForm
        popupLabel={buttons[currentButtonIndex].popupLabel}
        type={buttons[currentButtonIndex].formType}
        setVisible={setVisible}
        clientId={buttons[currentButtonIndex].clientId}
        update={buttons[currentButtonIndex].update}
        setUpdate={buttons[currentButtonIndex].setUpdate}
      />
    ),
    createClient: () => (
      <CreateClientForm
        popupLabel={buttons[currentButtonIndex].popupLabel}
        type={buttons[currentButtonIndex].formType}
        setVisible={setVisible}
        clientId={buttons[currentButtonIndex].clientId}
        update={buttons[currentButtonIndex].update}
        setUpdate={buttons[currentButtonIndex].setUpdate}
      />
    ),
    editDiscount: () => (
      <DiscountForm
        popupLabel={<SafeFormatMessage id="Edit-Discount" />}
        type={'edit'}
        visible={visible}
        setVisible={setVisible}
        discountData={buttons[currentButtonIndex].discountData}
      />
    ),
    AddValidationUrl: () => (
      <AddValidationUrlForm
        productId={buttons[currentButtonIndex].id}
        setVisible={setVisible}
        setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
      />
    ),
  }

  return (
    <Wrapper direction={direction} className="d-flex">
      <div
        className="dynamicAction"
        style={{
          borderRadius: more
            ? direction === 'rtl'
              ? '0 8px 8px 0'
              : '8px 0 0 8px'
            : '8px',
        }}
      >
        {buttons?.map((button, index) => {
          button.variant = button.variant || 'secondary'
          if (button.order <= 3) {
            if (button.type === 'action') {
              return (
                <span key={index}>
                  <Button variant={button.variant} onClick={button.func}>
                    {button.icon}{' '}
                    {button.label && <SafeFormatMessage id={button.label} />}
                  </Button>
                </span>
              )
            } else if (button.type === 'delete') {
              return (
                <span key={index}>
                  <Button
                    onClick={() => {
                      setConfirm(true)
                      setCurrentButtonIndex(index)
                    }}
                  >
                    {button.icon}
                    {button.label && <SafeFormatMessage id={button.label} />}
                  </Button>
                </span>
              )
            } else if (button.type === 'form') {
              return (
                <span key={index}>
                  <Button
                    variant={button.variant}
                    onClick={() => {
                      setVisible(true)
                      setCurrentButtonIndex(index)
                    }}
                    disabled={button.disable}
                  >
                    {button.icon}{' '}
                    {button.label && <SafeFormatMessage id={button.label} />}
                  </Button>
                </span>
              )
            } else if (button.type === 'toggle') {
              console.log(button.group)
              return (
                <span key={index}>
                  <Button
                    variant={
                      toggleStates[button.group][index]
                        ? button.variant
                        : `${button.variant} transparent`
                    }
                    onClick={() => {
                      console.log({ index })

                      handleToggle(index, button.group)
                    }}
                    className={classNames({
                      'tog-btn-on': toggleStates[button.group][index],
                      'tog-btn-off': !toggleStates[button.group][index],
                      'first-tog-btn': index == 0,
                      'last-tog-btn': index == 1,
                      'dark-tog-btn': button.group != 'grid-switcher',
                      'light-tog-btn': button.group == 'grid-switcher',
                    })}
                  >
                    {button.icon}
                    {'  '}
                    {button.label && <SafeFormatMessage id={button.label} />}
                  </Button>
                </span>
              )
            }
          }
        })}
      </div>

      {more && (
        <div className="dropdown">
          <Dropdown>
            <Dropdown.Toggle as={Button} className="buttonMore">
              <span className="icon icon-small">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-1">
              {buttons?.map((button, index) => {
                if (button.order > 3) {
                  if (button.type === 'delete') {
                    return (
                      <>
                        {button.separator && button.separator === true && (
                          <Dropdown.Divider />
                        )}
                        <span key={index}>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="redColor"
                            onClick={() => {
                              setConfirm(true)
                              setCurrentButtonIndex(index)
                            }}
                          >
                            {button.icon}{' '}
                            {button.label && (
                              <SafeFormatMessage id={button.label} />
                            )}
                          </Dropdown.Item>
                        </span>
                      </>
                    )
                  } else if (button.type === 'form') {
                    return (
                      <>
                        {button.separator && button.separator === true && (
                          <Dropdown.Divider />
                        )}
                        <Dropdown.Item
                          className={`${button.variant && button.variant}`}
                          key={index}
                          onClick={() => {
                            setVisible(true)
                            setCurrentButtonIndex(index)
                          }}
                          disabled={button.disable}
                        >
                          {button.icon}{' '}
                          {button.label && (
                            <SafeFormatMessage id={button.label} />
                          )}
                        </Dropdown.Item>
                      </>
                    )
                  } else if (button.type == 'action') {
                    if (button.label != 'Delete') {
                      return (
                        <>
                          {button.separator && button.separator === true && (
                            <Dropdown.Divider />
                          )}
                          <Dropdown.Item
                            key={index}
                            onClick={button.func}
                            disabled={button.disable}
                          >
                            {button.icon}{' '}
                            {button.label && (
                              <SafeFormatMessage id={button.label} />
                            )}
                          </Dropdown.Item>
                        </>
                      )
                    } else {
                      return (
                        <>
                          {button.separator && button.separator === true && (
                            <Dropdown.Divider />
                          )}
                          <span key={index}>
                            <Dropdown.Item
                              onClick={button.func}
                              className="redColor"
                              disabled={button.disable}
                            >
                              {button.icon}{' '}
                              {button.label && (
                                <SafeFormatMessage id={button.label} />
                              )}
                            </Dropdown.Item>
                          </span>
                        </>
                      )
                    }
                  } else if (button.type === 'toggle') {
                    return (
                      <>
                        {button.separator && button.separator === true && (
                          <Dropdown.Divider />
                        )}
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleToggle(index, button.group)}
                          className={`${button.variant && button.variant}`}
                          style={{
                            opacity: toggleStates[button.group][index]
                              ? 1
                              : 0.5,
                          }}
                        >
                          {button.icon}{' '}
                          {button.label && (
                            <SafeFormatMessage id={button.label} />
                          )}
                          {toggleStates[button.group][index] ? (
                            <FontAwesomeIcon icon={faToggleOn} />
                          ) : (
                            <FontAwesomeIcon icon={faToggleOff} />
                          )}
                        </Dropdown.Item>
                      </>
                    )
                  }
                }
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      <DeleteConfirmation
        message={
          <SafeFormatMessage
            id={buttons[currentButtonIndex]?.confirmationMessage}
          />
        }
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={deleteItem}
        sideBar={false}
      />

      <ThemeDialog
        visible={visible}
        setVisible={setVisible}
        size={
          buttons[currentButtonIndex]?.size
            ? buttons[currentButtonIndex]?.size
            : ''
        }
      >
        {currentButtonIndex !== undefined &&
        buttons?.[currentButtonIndex].type === 'form'
          ? forms[buttons?.[currentButtonIndex]?.component]()
          : null}
      </ThemeDialog>
    </Wrapper>
  )
}

export default DynamicButtons
