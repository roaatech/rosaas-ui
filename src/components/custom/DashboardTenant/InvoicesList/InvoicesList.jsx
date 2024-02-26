import { Button, Card } from '@themesberg/react-bootstrap'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Label from '../../Shared/label/Label'
import { useNavigate, useParams } from 'react-router-dom'
import {
  orderStatus,
  paymentStatus,
} from '../../../../const/subscriptionManagement'
import useRequest from '../../../../axios/apis/useRequest'
import {
  setAllOrders,
  setStep,
  setTenantCreateData,
} from '../../../../store/slices/tenants'

import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import { Wrapper } from '../DashboardTenant.styled'
import UpDownGradeForm from '../../tenant/SubscriptionManagement/UpgradeForm/UpDowngradeForm'

function InvoicesList({ price, product }) {
  const { getOrdersListByTenantId } = useRequest()
  let tenantsData = useSelector((state) => state.tenants.tenants)
  const tenantId = useParams().id
  const currentTenantData = tenantsData[tenantId]
  let ordersList = tenantsData[tenantId]?.orders

  const [visible, setVisible] = useState()
  const dispatch = useDispatch()
  useEffect(() => {
    if (tenantsData[tenantId]?.orders) {
      return
    }
    ;(async () => {
      const orders = await getOrdersListByTenantId(tenantId)

      dispatch(
        setAllOrders({
          tenantId,
          data: orders.data.data,
        })
      )
    })()
  }, [tenantId])

  let direction = useSelector((state) => state.main.direction)

  const navigate = useNavigate()

  const handleButtonClick = (id, planPriceId) => {
    dispatch(setStep(2))
    navigate(`/payment/product/${product}/subscribtion/${planPriceId}`)
    dispatch(
      setTenantCreateData({
        tenantData: ordersList[id],
        tenantInfo: currentTenantData,
      })
    )
  }
  const [currentOrderId, setCurrentOrderId] = useState('')
  const changeOrderPlanForm = (id) => {
    setVisible(true)
    setCurrentOrderId(id)
  }

  return (
    <Wrapper direction={direction}>
      <Card.Body className="py-0 px-0 ">
        <div className="timeLineCont card p-2">
          <div className="p-2 border-bottom mb-1 border-light">
            <label htmlFor="">
              <FormattedMessage id="Order-History" />
            </label>
            <div>
              <FormattedMessage id="Manage-Billing-Information-and-View-Receipts" />
            </div>
          </div>
          {ordersList &&
            Object.values(ordersList).map((item, index) => (
              <div key={index} className="border-bottom  border-light">
                <div className="time-line-item-container" key={index}>
                  <div className="timeLineItemCont" key={index}>
                    <div className="flex justify-content-between flex-wrap">
                      <div className="mb-2 fw-bold">
                        <FormattedMessage id="Order" /> #{item?.orderNumber}
                      </div>

                      {!item?.hasToPay ? (
                        <div className="author mb-2">
                          <Label {...paymentStatus[item?.paymentStatus]} />
                        </div>
                      ) : !item.isMustChangePlan ? (
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleButtonClick(
                              item.orderId,
                              item.orderItems[0].planPriceId
                            )
                          }
                          className="font-small"
                        >
                          <FormattedMessage id="Pay-Now" />
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => changeOrderPlanForm(item.orderId)}
                          className="font-small"
                        >
                          <FormattedMessage id="Select-Your-Plan" />
                        </Button>
                      )}
                    </div>
                    <div className="flex justify-content-between flex-wrap">
                      <div
                        className="time mb-2 small"
                        style={{ color: orderStatus[item?.orderStatus]?.color }}
                      >
                        {orderStatus[item?.orderStatus]?.value && (
                          <FormattedMessage
                            id={orderStatus[item?.orderStatus]?.value}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <ThemeDialog visible={visible} setVisible={setVisible}>
          <UpDownGradeForm
            popupLabel={<FormattedMessage id={'Change-Order-Plan'} />}
            tenantData={currentTenantData}
            visible={visible}
            setVisible={setVisible}
            sideBar={false}
            selectedProduct={product}
            type={'changeOrderPlan'}
            currentOrderId={currentOrderId}
          />
        </ThemeDialog>
      </Card.Body>
    </Wrapper>
  )
}
export default InvoicesList
