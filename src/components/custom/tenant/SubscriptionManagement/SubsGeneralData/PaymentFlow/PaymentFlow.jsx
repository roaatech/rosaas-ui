import { Button, Card, Container, Row } from '@themesberg/react-bootstrap'
import CustomPaginator from '../../../../Shared/CustomPaginator/CustomPaginator'
import { useState } from 'react'
import { Wrapper } from './PaymentFlow.styled'
import { useSelector } from 'react-redux'
import { DataTransform } from '../../../../../../lib/sharedFun/Time'
import { FormattedMessage } from 'react-intl'
import { HealthStatus, Owner, processType } from '../../../../../../const'
import Label from '../../../../Shared/label/Label'
import MetaDataAccordion from '../../../MetaDataAccordion/MetaDataAccordion'
import { Routes, useNavigate } from 'react-router-dom'
import { paymentStatus } from '../../../../../../const/subscriptionManagement'

function PaymentFlow() {
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  let direction = useSelector((state) => state.main.direction)

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('../dashboard')
  }
  const paymentData = {
    items: {
      0: {
        type: 4,
        invoice: {
          number: 'INV001',
          billedDate: '2023-11-29T05:36:40.3238557',
        },
      },
      1: {
        type: 2,
        invoice: {
          number: 'INV002',
          billedDate: '2023-11-29T05:36:40.3238557',
        },
      },
      2: {
        type: 3,
        invoice: {
          number: 'INV003',
          billedDate: '2023-11-29T05:36:40.3238557',
        },
      },

      3: {
        type: 1,
        invoice: {
          number: 'INV004',
          billedDate: '2023-11-29T05:36:40.3238557',
        },
      },
    },
    totalCount: 4,
  }

  const allItems = () => {
    let items = []
    for (let i = first; i < first + rows; i++) {
      if (paymentData?.items[i]) items = [...items, paymentData.items[i]]
    }
    return items
  }

  return (
    <Wrapper direction={direction}>
      <Card.Body className="py-0 px-0 ">
        <div className="timeLineCont card p-2">
          <div className="p-2 border-bottom mb-1 border-light">
            <label htmlFor="">Order History</label>
            <div>Manage billing information and view receipts</div>
          </div>
          {allItems().map((item, index) => (
            <div key={index} className="border-bottom  border-light">
              <div className="time-line-item-container" key={index}>
                <div className="timeLineItemCont" key={index}>
                  <div className="flex justify-content-between flex-wrap">
                    <div className="mb-2 fw-bold">
                      <FormattedMessage id="Invoice" /> {item?.invoice?.number}
                    </div>

                    {item?.type != 4 ? (
                      <div className="author mb-2 small">
                        <Label {...paymentStatus[item?.type]} />
                      </div>
                    ) : (
                      <div
                        onClick={handleButtonClick}
                        style={{ cursor: 'pointer' }}
                        className="hoverable-div"
                      >
                        <Label {...paymentStatus[item?.type]} />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-content-between flex-wrap">
                    <div className="time mb-2">
                      <FormattedMessage id="Billed" />{' '}
                      {item?.invoice?.billedDate &&
                        DataTransform(item?.invoice?.billedDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <CustomPaginator
            first={first}
            rows={rows}
            totalCount={paymentData?.totalCount}
            onPageChange={onPageChange}
            rowsPerPageOptions={[10, 20, 9]}
          />
        </div>
      </Card.Body>
    </Wrapper>
  )
}
export default PaymentFlow
