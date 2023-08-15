import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table } from '@themesberg/react-bootstrap'

import { Button } from 'primereact/button'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import useRequest from '../../../../axios/apis/useRequest'

import { Wrapper } from './ProdcutDetailsTab.styled'
import ProductForm from '../ProductForm/ProductForm'
import UrlItemList from '../../../../components/custom/Product/UrlItemList/UrlItemList'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'

const ProductDetailsTab = ({ data }) => {
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [productData, setProductData] = useState(data)
  const [visible, setVisible] = useState(false)

  const { deleteProductReq } = useRequest()
  const routeParams = useParams()
  const navigate = useNavigate()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deleteProduct = async () => {
    await deleteProductReq({ id: currentId })
    navigate(`/products`)
  }

  useEffect(() => {
    ;(async () => {
      // setProductData(data);
    })()
  }, [visible, routeParams.id])

  return (
    <Wrapper>
      {data && (
        <div className="main">
          <div className="details">
            <Card border="light" className="shadow-sm mb-4">
              <Card.Body className="pb-0">
                <Table
                  responsive
                  className="table-centered table-nowrap rounded mb-0"
                >
                  <tbody>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Name" />
                      </td>
                      <td>{data.name}</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Client" />
                      </td>
                      <td>{data.client.name}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Created-Date" />
                      </td>
                      <td>{DataTransform(data.createdDate)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Last-Updated-Date" />
                      </td>
                      <td>{DataTransform(data.editedDate)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Api-key" />
                      </td>
                      <td>{data.apiKey}</td>
                    </tr>
                    <UrlItemList data={data} />
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <div className="action">
              <Button
                className="mr-3"
                label={<FormattedMessage id="Delete" />}
                icon="pi pi-trash"
                onClick={() => deleteConfirm(data.id)}
                style={{
                  backgroundColor: 'var(--red)',
                  borderColor: 'var(--red)',
                }}
              />
              <Button
                className="mr-3"
                label={<FormattedMessage id="Edit" />}
                icon="pi pi-pencil"
                onClick={() => setVisible(true)}
                style={{
                  backgroundColor: 'var(--themeColor)',
                  borderColor: 'var(--themeColor)',
                }}
              />
            </div>
            <DeleteConfirmation
              message={
                <FormattedMessage id="delete-product-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteProduct}
              sideBar={false}
            />

            <ThemeDialog visible={visible} setVisible={setVisible}>
              <ProductForm
                type={'edit'}
                visible={visible}
                productData={data}
                setVisible={setVisible}
                popupLabel={<FormattedMessage id="Edit Product" />}
              />
            </ThemeDialog>
          </div>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductDetailsTab
