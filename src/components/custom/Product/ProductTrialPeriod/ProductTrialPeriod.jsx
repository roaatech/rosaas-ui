import React from 'react'
import { useState } from 'react'

import {
  Card,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from '@themesberg/react-bootstrap'

import { Wrapper } from './ProductTrialPeriod.styled'
import UrlItemList from '../UrlItemList/UrlItemList'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { ProductTrialType } from '../../../../const/product'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { setAllPlans } from '../../../../store/slices/products/productsSlice'
import Label from '../../Shared/label/Label'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopwatch } from '@fortawesome/free-solid-svg-icons'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

const ProductTrialPeriod = ({ data, setActiveIndex }) => {
  const [code, setCode] = useState(data.apiKey)
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')

  const handleCopy = () => {
    setToolTipText('Copied')
    setTimeout(() => {
      setToolTipText('Copy-to-clipboard')
    }, 2000)
  }
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
                    <Col md={12}>
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
              </Row>
            </Card>
          </div>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductTrialPeriod
