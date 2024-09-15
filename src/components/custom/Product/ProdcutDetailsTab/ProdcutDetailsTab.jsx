import React, { useState, useEffect } from 'react'
import { Card, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap'
import { Wrapper } from './ProdcutDetailsTab.styled'
import UrlItemList from '../../../../components/custom/Product/UrlItemList/UrlItemList'
import { FormattedMessage, useIntl } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { textLocale, ProductTrialType } from '../../../../const/product'
import { useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { setAllPlans } from '../../../../store/slices/products/productsSlice'
import Label from '../../Shared/label/Label'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import useSharedFunctions from '../../Shared/SharedFunctions/SharedFunctions'

const ProductDetailsTab = ({ data }) => {
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')
  const intl = useIntl()

  const [selectedLanguage, setSelectedLanguage] = useState(intl.locale) // State for language selection

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
      {/* Dynamic Buttons for Language Selection */}
      <div className="dynamicButtons pt-0 mt-0 mb-1 ">
        <DynamicButtons
          buttons={[
            ...Object.keys({ en: 'English', ar: 'Arabic' }).map((lang) => ({
              order: 1,
              type: 'toggle',
              label: lang,
              group: 'language',
              toggleValue: selectedLanguage === lang,
              toggleFunc: () => setSelectedLanguage(lang),
              variant: 'primary',
            })),
          ]}
        />
      </div>
      {data && (
        <div className="main">
          <div className="details">
            <Row>
              <Card.Body className="py-0 px-3">
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="Display-Name" />
                  </td>
                  <td className="card-stats">
                    {textLocale(
                      data.displayNameLocalizations,
                      selectedLanguage,
                      intl
                    )}
                  </td>
                </tr>
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="System-Name" />
                  </td>
                  <td className="card-stats">{data.systemName}</td>
                </tr>
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="Client" />
                  </td>
                  <td className="card-stats">{data.client?.systemName}</td>
                </tr>
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="Description" />
                  </td>
                  <td className="card-stats">
                    <DescriptionCell
                      data={{
                        description: textLocale(
                          data.descriptionLocalizations,
                          selectedLanguage,
                          intl
                        ),
                      }}
                    />
                  </td>
                </tr>
                {data?.trialType === 2 && (
                  <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                    <td className="mb-0 w-50 fw-bold">
                      <SafeFormatMessage id="Trial-Period-In-Days" />
                    </td>
                    <td className="card-stats">{data?.trialPeriodInDays}</td>
                  </tr>
                )}
              </Card.Body>
              <Card.Body className="py-0 px-3">
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="Created-Date" />
                  </td>
                  <td className="card-stats">
                    {DataTransform(data?.createdDate)}
                  </td>
                </tr>
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="Last-Updated-Date" />
                  </td>
                  <td className="card-stats">
                    {DataTransform(data?.editedDate)}
                  </td>
                </tr>
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="Api-key" />
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
                              {<SafeFormatMessage id={toolTipText} />}
                            </div>
                          </Tooltip>
                        }
                      >
                        <CopyToClipboard text={data.apiKey} onCopy={handleCopy}>
                          <span className="copyItem ml-1">
                            <AiFillCopy />
                          </span>
                        </CopyToClipboard>
                      </OverlayTrigger>
                    </span>
                  </td>
                </tr>
                <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                  <td className="mb-0 w-50 fw-bold">
                    <SafeFormatMessage id="Trial-Type" />
                  </td>
                  <td className="card-stats">
                    {ProductTrialType[data?.trialType] && (
                      <Label {...ProductTrialType[data?.trialType]} />
                    )}
                  </td>
                </tr>
                {data?.trialType === 2 && (
                  <tr className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                    <td className="mb-0 w-50 fw-bold">
                      <SafeFormatMessage id="Trial-Plan" />
                    </td>
                    <td className="card-stats">
                      {listData[productId].plans &&
                        textLocale(
                          listData[productId].plans?.[data?.trialPlanId]
                            ?.displayNameLocalizations,
                          selectedLanguage,
                          intl
                        )}
                    </td>
                  </tr>
                )}
              </Card.Body>
            </Row>
          </div>
        </div>
      )}
    </Wrapper>
  )
}

export default ProductDetailsTab
