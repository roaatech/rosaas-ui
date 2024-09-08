import React, { useEffect } from 'react'
import useRequest from '../../../../axios/apis/useRequest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { Card, Alert } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { productWarningsStore } from '../../../../store/slices/products/productsSlice.js'
import { WarningVariant } from '../../../../const/WarningsSettings'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

export const ProductWarnings = ({ productId }) => {
  const { getProductWarnings } = useRequest()
  const dispatch = useDispatch()

  const direction = useSelector((state) => state.main.direction)
  const warningsList = useSelector(
    (state) => state.products.products[productId]?.warnings?.data
  )
  useEffect(() => {
    if (!warningsList && productId) {
      ;(async () => {
        const productData = await getProductWarnings(productId)
        dispatch(
          productWarningsStore({ id: productId, data: productData.data.data })
        )
      })()
    }
  }, [productId, warningsList])

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        {warningsList &&
          warningsList.map((warning, index) => {
            const { property, isValid, setting } = warning
            const type = setting.type
            const message =
              direction === 'rtl' ? setting.message.ar : setting.message.en
            let warningVariants, icon
            if (isValid === true) {
              warningVariants = WarningVariant[1]
              icon = faCheckCircle
            } else {
              warningVariants = WarningVariant[type] || WarningVariant[4]
              icon = faTriangleExclamation
            }

            if (warningVariants === 'danger') {
              icon = faExclamationCircle
            }
            const formattedProperty =
              property.charAt(0).toLowerCase() + property.slice(1)

            return (
              <div key={index}>
                <Alert variant={warningVariants}>
                  <FontAwesomeIcon icon={icon} className="mr-2" />
                  <strong>
                    <SafeFormatMessage id={formattedProperty} /> :
                  </strong>{' '}
                  {message}
                </Alert>
              </div>
            )
          })}
      </Card.Body>
    </Card>
  )
}

export default ProductWarnings
