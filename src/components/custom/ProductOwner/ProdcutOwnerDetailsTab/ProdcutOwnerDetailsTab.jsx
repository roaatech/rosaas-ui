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

import { Wrapper } from './ProdcutOwnerDetailsTab.styled'
import UrlItemList from '../../Product/UrlItemList/UrlItemList'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy, AiFillEdit } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { ProductTrialType, PublishStatus } from '../../../../const/product'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { setAllPlans } from '../../../../store/slices/products/productsSlice'
import Label from '../../Shared/label/Label'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import BreadcrumbComponent from '../../Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam, BsFillTrash3Fill } from 'react-icons/bs'
import UpperContent from '../../Shared/UpperContent/UpperContent'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import {
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
} from 'react-icons/md'
import { TabPanel, TabView } from 'primereact/tabview'
import {
  productOwnerChangeAttr,
  productOwnerInfo,
  removeProductOwnerStore,
} from '../../../../store/slices/productsOwners'
import { Routes } from '../../../../routes'
import { object } from 'yup'
import { update } from 'lodash'

const ProductOwnerDetails = () => {
  const routeParams = useParams()
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const [activeIndex, setActiveIndex] = useState(0)
  const [update, setUpdate] = useState(0)
  useEffect(() => {
    setActiveIndex(0)
  }, [routeParams.id])

  const {
    getProductOwner,
    deleteProductOwnerReq,
    GetCurrentProductOwnerByUserId,
  } = useRequest()
  let userRole = useSelector((state) => state.auth.userInfo.userType)
  console.log(userRole == 'clientAdmin')
  const navigate = useNavigate()
  useEffect(() => {
    if (userRole == 'clientAdmin') {
      return
    }
    ;(async () => {
      const productOwnerData = await getProductOwner(routeParams.id)
      dispatch(
        productOwnerInfo({
          id: routeParams.id,
          data: productOwnerData.data.data,
        })
      )
    })()
  }, [visible, routeParams?.id])
  useEffect(() => {
    if (userRole != 'clientAdmin') {
      return
    }
    ;(async () => {
      const productOwnerData = await GetCurrentProductOwnerByUserId()
      dispatch(
        productOwnerInfo({
          id: routeParams.id,
          data: productOwnerData.data.data,
        })
      )
    })()
  }, [visible, routeParams?.id])

  const listData = useSelector((state) => state.productsOwners.productsOwners)
  let productOwner = listData?.[routeParams.id]

  const deleteProductOwner = async () => {
    await deleteProductOwnerReq(routeParams?.id)
    dispatch(removeProductOwnerStore(routeParams?.id))
  }
  const handleProductClick = (productId) => {
    navigate(`${Routes.products.path}/${productId}`) // Navigate to product details page
  }

  return (
    <Wrapper>
      {productOwner && (
        <BreadcrumbComponent
          breadcrumbInfo={'ProductsOwnersDetails'}
          param1={productOwner.id}
          icon={BsBoxSeam}
          data={{ name: productOwner.ownerName }}
        />
      )}

      {productOwner && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Product-Owner-Details" /> :{' '}
              {productOwner.systemName}{' '}
            </h4>
            <DynamicButtons
              buttons={[
                {
                  order: 2,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Edit',
                  component: 'editProductOwner',
                  icon: <AiFillEdit />,
                  setActiveIndex: setActiveIndex,
                  update: update,
                  setUpdate: setUpdate,
                },
                {
                  order: 5,
                  type: 'delete',
                  confirmationMessage:
                    'delete-product-owner-confirmation-message',
                  id: routeParams.id,
                  navAfterDelete: Routes.productsOwners.path,
                  label: 'Delete-Product-Owner',
                  request: deleteProductOwner,
                  icon: <BsFillTrash3Fill />,
                },
              ]}
            />
          </UpperContent>

          <TabView
            scrollable
            className="card"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            {productOwner && (
              <TabPanel header={<FormattedMessage id="Details" />}>
                <div className="row-button">
                  <div className="dynamicButtons"></div>
                </div>
                <Card border="light" className="shadow-sm border-0">
                  <Card.Body className="p-0">
                    <Table
                      responsive
                      className="table-centered table-nowrap rounded mb-0"
                    >
                      <tbody>
                        <tr>
                          <td className="fw-bold line-cell">
                            <FormattedMessage id="Display-Name" />
                          </td>
                          <td className="line-cell">
                            {productOwner.displayName}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">
                            <FormattedMessage id="System-Name" />
                          </td>
                          <td>{productOwner.systemName}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">
                            <FormattedMessage id="Products" />
                          </td>
                          <td>
                            {productOwner.products &&
                              Object.values(productOwner.products) &&
                              Object.values(productOwner.products).map(
                                (product, index) => (
                                  <span
                                    key={index}
                                    className="p-1 border-round border-1 border-400 mx-2"
                                    onClick={() =>
                                      handleProductClick(product.id)
                                    }
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {product.systemName}
                                  </span>
                                )
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">
                            <FormattedMessage id="Created-Date" />
                          </td>
                          <td>{DataTransform(productOwner.createdDate)}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">
                            <FormattedMessage id="Last-Updated-Date" />
                          </td>
                          <td>{DataTransform(productOwner.editedDate)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </TabPanel>
            )}
          </TabView>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductOwnerDetails
