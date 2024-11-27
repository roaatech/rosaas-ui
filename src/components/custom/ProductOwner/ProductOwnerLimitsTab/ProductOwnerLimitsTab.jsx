import React, { useEffect, useState } from 'react'
import { TabPanel } from 'primereact/tabview'
import { Table, Card } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { productOwnerChangeAttr } from '../../../../store/slices/productsOwners'
import { Wrapper } from './ProductOwnerLimitsTab.styled'
import { LimitType, roundingTypeOptions } from '../../../../const/const'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

const ProductOwnerLimitsTab = ({ productOwnerId }) => {
  const dispatch = useDispatch()
  const { ProductOwnerLimits } = useRequest()

  const productOwnerLimits = useSelector(
    (state) => state.productsOwners.productsOwners?.[productOwnerId]?.limits
  )
  const [productOwnerLimitsList, setProductOwnerLimitsList] = useState([])

  useEffect(() => {
    if (productOwnerLimits && Object.keys(productOwnerLimits).length > 0) {
      return setProductOwnerLimitsList(Object.values(productOwnerLimits))
    }
    const fetchLimits = async () => {
      try {
        const response = await ProductOwnerLimits(productOwnerId)
        setProductOwnerLimitsList(response.data.data)
        dispatch(
          productOwnerChangeAttr({
            productOwnerId,
            attributes: { limits: response.data.data },
          })
        )
      } catch (error) {
        console.error('Failed to fetch limits', error)
      }
    }
    fetchLimits()
  }, [productOwnerId])

  return (
    <Wrapper>
      <Card
        border="light"
        className="border-light table-wrapper table-responsive shadow-sm"
      >
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th>
                  <SafeFormatMessage id="Limit-Type" />
                </th>
                <th>
                  <SafeFormatMessage id="Max-Limit" />
                </th>
                <th>
                  <SafeFormatMessage id="Current-Usage" />
                </th>
                <th>
                  <SafeFormatMessage id="Remaining" />
                </th>
                <th>
                  <SafeFormatMessage id="Is-Unlimited" />
                </th>
              </tr>
            </thead>
            <tbody>
              {productOwnerLimitsList &&
                Object.values(productOwnerLimitsList).map((limit, index) => (
                  <tr key={index}>
                    <td>{LimitType[limit.limitType]} </td>{' '}
                    <td>{limit.maxLimit}</td>
                    <td>{limit.currentUsage}</td>
                    <td>{limit.remaining}</td>
                    <td>{limit.isUnlimited ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default ProductOwnerLimitsTab
