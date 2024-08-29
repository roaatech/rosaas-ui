import React, { useEffect, useState } from 'react'
import { TabPanel } from 'primereact/tabview'
import { Table, Card } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { productOwnerChangeAttr } from '../../../../store/slices/productsOwners'
import { Wrapper } from './ProductOwnerLimitsTab.styled'

const ProductOwnerLimitsTab = ({ productOwnerId }) => {
  const dispatch = useDispatch()
  const { ProductOwnerLimits } = useRequest()

  const productOwnerLimits = useSelector(
    (state) => state.productsOwners.productsOwners[productOwnerId].limits
  )

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await ProductOwnerLimits(productOwnerId)
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
  }, [productOwnerId, dispatch])

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
                  <FormattedMessage id="Limit-Type" />
                </th>
                <th>
                  <FormattedMessage id="Max-Limit" />
                </th>
                <th>
                  <FormattedMessage id="Current-Usage" />
                </th>
                <th>
                  <FormattedMessage id="Remaining" />
                </th>
                <th>
                  <FormattedMessage id="Is-Unlimited" />
                </th>
              </tr>
            </thead>
            <tbody>
              {productOwnerLimits &&
                Object.values(productOwnerLimits).map((limit, index) => (
                  <tr key={index}>
                    <td>{limit.limitType}</td>
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
