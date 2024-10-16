import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import ThemeDialog from '../ThemeDialog/ThemeDialog'
import ProductForm from '../../Product/ProductForm/ProductForm'
import useRequest from '../../../../axios/apis/useRequest'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TenantForm from '../../tenant/TenantForm/TenantForm'
import { Dropdown, Button } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Wrapper } from './DynamicButtons.styled'
import FeatureForm from '../../Product/ProductFeaturesList/FeatureForm/FeatureForm'
import FeaturePlanForm from '../../Product/ProductFeaturePlan/FeaturePlanForm/FeaturePlanForm'
import PlanForm from '../../Product/ProductPlansList/PlanForm/PlanForm'
import { useEffect } from 'react'
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

const DynamicButtons = ({ buttons }) => {
  const { getTenant } = useRequest()
  const navigate = useNavigate()
  const productsData = useSelector((state) => state.products.products)
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const productOwnersData = useSelector(
    (state) => state.productsOwners.productsOwners
  )

  let direction = useSelector((state) => state.main.direction)
  const [tenantData, setTenantData] = useState()

  const [confirm, setConfirm] = useState(false)
  const [currentButtonIndex, setCurrentButtonIndex] = useState()
  const [more, setMore] = useState(false)
  const request = useRequest()
  const deleteItem = async () => {
    buttons[currentButtonIndex].request()
    navigate(buttons[currentButtonIndex].navAfterDelete)
  }
  // const deleteItem = async () => {
  //   await request[buttons[currentButtonIndex].request]({
  //     id: buttons[currentButtonIndex].id,
  //   })
  //   navigate(buttons[currentButtonIndex].navAfterDelete)
  // }

  useEffect(() => {
    ;(() => {
      const checkMoreArray = buttons.map((button) => {
        return button.order > 3
      })
      if (checkMoreArray.includes(true)) {
        setMore(true)
      } else {
        setMore(false)
      }
    })()
  }, [buttons])

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
    editTenantSpecification: () => (
      <>
        <TenantSpecificationForm
          popupLabel={<FormattedMessage id="Edit-Specification" />}
          type={'edit'}
          tenantData={tenantsData[buttons[currentButtonIndex].id]}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          updateTenant={buttons[currentButtonIndex].updateTenant}
          selectedProduct={buttons[currentButtonIndex].selectedProduct}
        />
      </>
    ),
    upDowngradeSubscription: () => (
      <>
        <UpDowngradeForm
          popupLabel={
            <FormattedMessage id={buttons[currentButtonIndex]?.label} />
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
      </>
    ),

    addFeaturePlan: () => (
      <>
        <FeaturePlanForm
          popupLabel={<FormattedMessage id="Add-Plan-Feature" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
        />
      </>
    ),
    editProductOwner: () => (
      <ProductOwnerForm
        popupLabel={<FormattedMessage id="Edit-Product-Owner" />}
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
      <>
        <PlanForm
          popupLabel={<FormattedMessage id="Add-Plan" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
        />
      </>
    ),
    addEndpoint: () => (
      <>
        <CreateWebhookForm
          visible={visible}
          setVisible={setVisible}
          popUpLable={<FormattedMessage id="Add-Endpoint" />}
          webhookId={buttons[currentButtonIndex].currentId}
          type={buttons[currentButtonIndex].formType}
        />
      </>
    ),
    addTrial: () => (
      <>
        <TrialForm
          popupLabel={<FormattedMessage id="Trial-Period" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
        />
      </>
    ),
    addCard: () => (
      <>
        <CardSaveFormWithStripe
          popupLabel={<FormattedMessage id="Add-Card" />}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          setCards={buttons[currentButtonIndex].setCards}
          cards={buttons[currentButtonIndex].cards}
        />
      </>
    ),
    addSpecification: () => (
      <>
        <CustomSpecificationForm
          popupLabel={<FormattedMessage id="Add-Custom-Specification" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
        />
      </>
    ),
    addPlanPrice: () => (
      <>
        <PlanPriceForm
          popupLabel={<FormattedMessage id="Add-Plan-Price" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
        />
      </>
    ),
    addFeature: () => (
      <>
        <FeatureForm
          popupLabel={<FormattedMessage id="Add-Feature" />}
          type={'create'}
          visible={visible}
          setVisible={setVisible}
          sideBar={false}
          setActiveIndex={buttons[currentButtonIndex].setActiveIndex}
        />
      </>
    ),
    createSecret: () => (
      <>
        <CreateSecretForm
          popupLabel={buttons[currentButtonIndex].popupLabel}
          type={buttons[currentButtonIndex].formType}
          setVisible={setVisible}
          clientId={buttons[currentButtonIndex].clientId}
          update={buttons[currentButtonIndex].update}
          setUpdate={buttons[currentButtonIndex].setUpdate}
        />
      </>
    ),
    changePassword: () => (
      <>
        <ChangePasswordForm
          popupLabel={buttons[currentButtonIndex].label}
          setVisible={setVisible}
        />
      </>
    ),
    createTenantUser: () => (
      <>
        <CreateTenantUserForm
          popupLabel={buttons[currentButtonIndex].popupLabel}
          currentUser={buttons[currentButtonIndex].currentUser}
          type={buttons[currentButtonIndex].formType}
          setVisible={setVisible}
          clientId={buttons[currentButtonIndex].clientId}
          update={buttons[currentButtonIndex].update}
          setUpdate={buttons[currentButtonIndex].setUpdate}
        />
      </>
    ),
    createProductUser: () => (
      <>
        <CreateProductUserForm
          popupLabel={buttons[currentButtonIndex].popupLabel}
          type={buttons[currentButtonIndex].formType}
          setVisible={setVisible}
          clientId={buttons[currentButtonIndex].clientId}
          update={buttons[currentButtonIndex].update}
          setUpdate={buttons[currentButtonIndex].setUpdate}
        />
      </>
    ),
    createClient: () => (
      <>
        <CreateClientForm
          popupLabel={buttons[currentButtonIndex].popupLabel}
          type={buttons[currentButtonIndex].formType}
          setVisible={setVisible}
          clientId={buttons[currentButtonIndex].clientId}
          update={buttons[currentButtonIndex].update}
          setUpdate={buttons[currentButtonIndex].setUpdate}
        />
      </>
    ),
    editDiscount: () => (
      <DiscountForm
        popupLabel={<FormattedMessage id="Edit-Discount" />}
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
          borderRadius:
            more == true
              ? direction == 'rtl'
                ? '0 8px 8px 0'
                : '8px 0 0 8px'
              : '8px',
        }}
      >
        {/* {more.toString()} */}
        {buttons.map((button, index) => {
          button.variant
            ? (button.variant = button.variant)
            : (button.variant = 'secondary')
          if (button.order <= 3) {
            if (button.type == 'action') {
              return (
                <span key={index}>
                  <Button variant={button.variant} onClick={button.func}>
                    {button.icon}{' '}
                    {button.label && <FormattedMessage id={button.label} />}
                  </Button>
                </span>
              )
            } else if (button.type == 'delete') {
              return (
                <span key={index}>
                  <Button
                    onClick={() => {
                      setConfirm(true)
                      setCurrentButtonIndex(index)
                    }}
                  >
                    {button.icon}
                    {button.label && <FormattedMessage id={button.label} />}
                  </Button>
                </span>
              )
            } else if (button.type == 'form') {
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
                    {button.label && <FormattedMessage id={button.label} />}
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
              {buttons.map((button, index) => {
                if (button.order > 3)
                  if (button.type == 'delete') {
                    return (
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
                            <FormattedMessage id={button.label} />
                          )}
                        </Dropdown.Item>
                      </span>
                    )
                  } else if (button.type == 'form') {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={() => {
                          setVisible(true)
                          setCurrentButtonIndex(index)
                        }}
                        disabled={button.disable}
                      >
                        {button.icon}{' '}
                        {button.label && <FormattedMessage id={button.label} />}
                      </Dropdown.Item>
                    )
                  } else if (button.type == 'action') {
                    if (button.label != 'Delete') {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={button.func}
                          disabled={button.disable}
                        >
                          {button.icon}{' '}
                          {button.label && (
                            <FormattedMessage id={button.label} />
                          )}
                        </Dropdown.Item>
                      )
                    } else {
                      return (
                        <span key={index}>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            onClick={button.func}
                            className="redColor"
                            disabled={button.disable}
                          >
                            {button.icon}{' '}
                            {button.label && (
                              <FormattedMessage id={button.label} />
                            )}
                          </Dropdown.Item>
                        </span>
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

      <ThemeDialog
        visible={visible}
        setVisible={setVisible}
        size={
          buttons[currentButtonIndex]?.component === 'addSpecification' ||
          buttons[currentButtonIndex]?.component === 'addEndpoint'
            ? 'lg'
            : ''
        }
      >
        {currentButtonIndex !== undefined &&
        buttons[currentButtonIndex].type == 'form' ? (
          forms[buttons[currentButtonIndex]?.component]()
        ) : (
          <></>
        )}
      </ThemeDialog>
    </Wrapper>
  )
}

export default DynamicButtons
