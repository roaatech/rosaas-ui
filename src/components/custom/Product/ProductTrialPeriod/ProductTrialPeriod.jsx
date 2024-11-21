import React from 'react'
import { useState } from 'react'

import {
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from '@themesberg/react-bootstrap'

import { Wrapper } from './ProductTrialPeriod.styled'
import { useDispatch, useSelector } from 'react-redux'
import { activeStatus, ProductTrialType } from '../../../../const/product'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { setAllPlans } from '../../../../store/slices/products/productsSlice'
import Label from '../../Shared/label/Label'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopwatch } from '@fortawesome/free-solid-svg-icons'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { BsFillQuestionCircleFill } from 'react-icons/bs'

const ProductTrialPeriod = ({ data, setActiveIndex }) => {
  let direction = useSelector((state) => state.main.direction)
  const listData = useSelector((state) => state.products.products)
  const dispatch = useDispatch()

  const params = useParams()
  const { getProductPlans } = useRequest()
  const productId = params.id
  useEffect(() => {
    ;(async () => {
      if (listData[productId]) {
        if (!listData[productId].plans && data?.trialType == 2) {
          const planData = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: planData?.data.data,
            })
          )
        }
      }
    })()
  }, [productId])

  const TrialPaymentDetailsRequired = () => {
    return (
      <Col md={6}>
        <Card.Body className="py-0 px-3 ">
          <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
            <td className="mb-0 w-50 fw-bold">
              <SafeFormatMessage
                defaultMessage={'Payment Details Collection During Trial'}
                id={'Payment-Details-Collection-During-Trial'}
              />
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="top"
                overlay={
                  <Tooltip>
                    <div style={{ minWidth: '100px' }}>
                      <SafeFormatMessage
                        defaultMessage={
                          "Collecting the customer's payment details during the trial period subscription."
                        }
                        id={'Payment-Details-Collection-During-Trial-desc'}
                      />
                    </div>
                  </Tooltip>
                }
              >
                <span>
                  <BsFillQuestionCircleFill />
                </span>
              </OverlayTrigger>
            </td>
            <td className=" card-stats">
              {ProductTrialType[data?.trialType] && (
                <Label {...activeStatus[data?.isTrialPaymentDetailsRequired]} />
              )}
            </td>
          </tr>
        </Card.Body>
      </Col>
    )
  }

  return (
    <Wrapper>
      <div className="dynamicButtons pt-0 mt-0 mb-1">
        <DynamicButtons
          buttons={[
            {
              order: 2,
              type: 'form',
              id: productId,
              label: 'Trial-Period',
              component: 'addTrial',
              icon: <FontAwesomeIcon icon={faStopwatch} />,
              setActiveIndex: setActiveIndex,
            },
          ]}
        />
      </div>
      {data && (
        <div className="main">
          <div className="details">
            <Card border="light" className="shadow-sm mb-3 px-2">
              <Row>
                {data?.trialType != 2 ? (
                  <Card.Body className="py-0 px-3">
                    <Col md={6}>
                      <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                        <td className="mb-0 w-50 fw-bold">
                          <SafeFormatMessage id="Trial-Type" />
                        </td>
                        <td className=" card-stats">
                          {ProductTrialType[data?.trialType] && (
                            <Label {...ProductTrialType[data?.trialType]} />
                          )}
                        </td>
                      </tr>
                    </Col>
                  </Card.Body>
                ) : (
                  <>
                    <Col md={6}>
                      <Card.Body className="py-0 px-3">
                        <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                          <td className="mb-0 w-50 fw-bold">
                            <SafeFormatMessage id="Trial-Type" />
                          </td>
                          <td className=" card-stats">
                            {ProductTrialType[data?.trialType] && (
                              <Label {...ProductTrialType[data?.trialType]} />
                            )}
                          </td>
                        </tr>
                      </Card.Body>
                    </Col>
                    <Col md={6}>
                      <Card.Body className="py-0 px-3 ">
                        {data?.trialType == 2 && (
                          <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                            <td className="mb-0 w-50 fw-bold">
                              <SafeFormatMessage id="Trial-Plan" />
                            </td>
                            <td className=" card-stats">
                              {listData[productId].plans &&
                                listData[productId].plans?.[data?.trialPlanId]
                                  ?.displayName}
                            </td>
                          </tr>
                        )}
                      </Card.Body>
                    </Col>
                    <Col
                      md={6}
                      className={`${
                        direction == 'rtl' ? 'border-right-1' : 'border-left-1'
                      } border-light`}
                    >
                      <Card.Body className="py-0 px-3 ">
                        {data?.trialType == 2 && (
                          <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                            <td className="mb-0 w-50 fw-bold">
                              <SafeFormatMessage id="Trial-Period-In-Days" />
                            </td>
                            <td className=" card-stats">
                              {data?.trialPeriodInDays}
                            </td>
                          </tr>
                        )}
                      </Card.Body>
                    </Col>
                  </>
                )}
                {data?.trialType && data?.trialType != 1 ? (
                  TrialPaymentDetailsRequired()
                ) : (
                  <></>
                )}
              </Row>
            </Card>
          </div>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductTrialPeriod
