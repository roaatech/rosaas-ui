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

import { Wrapper } from './ProdcutDetailsTab.styled'
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

const ProductDetailsTab = ({ data }) => {
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
      {data && (
        <div className="main">
          <div className="details">
            <Card border="light" className="shadow-sm mb-3 px-2">
              <Row>
                <Col md={6}>
                  <Card.Body className="py-0 px-3">
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Display-Name" />
                      </td>
                      <td className=" card-stats">{data.displayName}</td>
                    </tr>
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="System-Name" />
                      </td>
                      <td className=" card-stats">{data.systemName}</td>
                    </tr>
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Client" />
                      </td>
                      <td className=" card-stats">{data.client?.systemName}</td>
                    </tr>{' '}
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Description" />
                      </td>
                      <td className="card-stats">
                        {data.description && <DescriptionCell data={data} />}
                      </td>
                    </tr>
                    {data?.trialType == 2 && (
                      <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                        <td className="mb-0 w-50 fw-bold">
                          <FormattedMessage id="Trial-Period-In-Days" />
                        </td>
                        <td className=" card-stats">
                          {data?.trialPeriodInDays}
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
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Created-Date" />
                      </td>
                      <td className=" card-stats">
                        {DataTransform(data?.createdDate)}
                      </td>
                    </tr>
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Last-Updated-Date" />
                      </td>
                      <td className="card-stats">
                        {DataTransform(data?.editedDate)}
                      </td>
                    </tr>
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Api-key" />
                      </td>
                      <td className="apikeyTd card-stats">
                        <span>{data.apiKey}</span>
                        <span className="relative">
                          <OverlayTrigger
                            style={{ minWidth: '150px' }}
                            trigger={['hover', 'focus']}
                            placement="top"
                            overlay={
                              <Tooltip>
                                <div style={{ minWidth: '100px' }}>
                                  {<FormattedMessage id={toolTipText} />}
                                </div>
                              </Tooltip>
                            }
                          >
                            <CopyToClipboard text={code} onCopy={handleCopy}>
                              <span className="copyItem ml-1">
                                <AiFillCopy />
                              </span>
                            </CopyToClipboard>
                          </OverlayTrigger>
                        </span>
                      </td>
                    </tr>
                    <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                      <td className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Trial-Type" />
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
                          <FormattedMessage id="Trial-Plan" />
                        </td>
                        <td className=" card-stats">
                          {listData[productId].plans &&
                            listData[productId].plans?.[data?.trialPlanId]
                              .displayName}
                        </td>
                      </tr>
                    )}
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card border="light" className="shadow-sm mb-4">
              <Card.Body className="pb-0">
                <Table
                  responsive
                  className="table-centered table-nowrap rounded mb-0 table"
                >
                  <tbody>
                    <UrlItemList data={data} />
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductDetailsTab
