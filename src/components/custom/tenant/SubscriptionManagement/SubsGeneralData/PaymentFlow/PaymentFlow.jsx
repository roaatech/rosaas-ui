import { Button, Card, Container, Row } from '@themesberg/react-bootstrap'
import CustomPaginator from '../../../../Shared/CustomPaginator/CustomPaginator'
import { useEffect, useState } from 'react'
import { Wrapper } from './PaymentFlow.styled'
import { useDispatch, useSelector } from 'react-redux'
import { DataTransform } from '../../../../../../lib/sharedFun/Time'
import { FormattedMessage } from 'react-intl'
import { HealthStatus, Owner, processType } from '../../../../../../const'
import Label from '../../../../Shared/label/Label'
import MetaDataAccordion from '../../../MetaDataAccordion/MetaDataAccordion'
import { Routes, useNavigate, useParams } from 'react-router-dom'
import {
  orderStatus,
  paymentStatus,
} from '../../../../../../const/subscriptionManagement'
import useRequest from '../../../../../../axios/apis/useRequest'
import {
  setAllOrders,
  setStep,
  setTenantCreateData,
} from '../../../../../../store/slices/tenants'

function PaymentFlow({ price, product }) {
  const { getOrdersListByTenantId } = useRequest()
  let tenantsData = useSelector((state) => state.tenants.tenants)
  const tenantId = useParams().id
  const currentTenantData = tenantsData[tenantId]
  let ordersList = tenantsData[tenantId]?.orders
  const dispatch = useDispatch()
  useEffect(() => {
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
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  let direction = useSelector((state) => state.main.direction)

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const navigate = useNavigate()

  const handleButtonClick = (id) => {
    dispatch(setStep(2))
    navigate(`/payment/product/${product}/subscribtion/${price}`)
    dispatch(
      setTenantCreateData({
        tenantData: ordersList[id],
        tenantInfo: currentTenantData,
      })
    )
  }

  return (
    <Wrapper direction={direction}>
      <Card.Body className="py-0 px-0 ">
        <div className="timeLineCont card p-2">
          <div className="p-2 border-bottom mb-1 border-light">
            <label htmlFor="">Order History</label>
            <div>Manage billing information and view receipts</div>
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
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => handleButtonClick(item.id)}
                          className="font-small"
                        >
                          <FormattedMessage id="Pay-Now" />
                        </Button>
                        // <div
                        //   onClick={handleButtonClick}
                        //   style={{ cursor: 'pointer' }}
                        //   className="hoverable-div"
                        // >
                        //   <Label {...paymentStatus[item?.type]} />
                        // </div>
                      )}
                    </div>
                    <div className="flex justify-content-between flex-wrap">
                      <div
                        className="time mb-2 small"
                        style={{ color: orderStatus[item?.orderStatus]?.color }}
                      >
                        {orderStatus[item?.orderStatus]?.value}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card.Body>
    </Wrapper>
  )
}
export default PaymentFlow
