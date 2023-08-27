import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  OverlayTrigger,
  Table,
  Tooltip,
} from '@themesberg/react-bootstrap'

import { Button } from 'primereact/button'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import useRequest from '../../../../axios/apis/useRequest'

import { Wrapper } from './FeatureDetailsTab.styled'

import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'
import TableDate from '../../Shared/TableDate/TableDate'
import FeatureForm from '../FeatureForm/FeatureForm'
import { FeatureInfo, storeFeatureDelete } from '../../../../store/slices/products'
import { useDispatch, useSelector } from 'react-redux'
import TextareaAndCounter from '../../Shared/TextareaAndCounter/TextareaAndCounter'
import { featureResetMap, featureTypeMap, featureUnitMap } from '../../../../const'

export const FeatureDetailsTab = ({ data }) => {
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [planData, setPlanData] = useState(data)
  const [visible, setVisible] = useState(false)
  const [update, setUpdate] = useState(1)
  const [code, setCode] = useState(data.apiKey)
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')

  const handleCopy = () => {
    setToolTipText('Copied')
    setTimeout(() => {
      setToolTipText('Copy-to-clipboard')
    }, 2000)
  }
  const dispatch = useDispatch()
  const {  deleteFeatureReq } = useRequest()
  const routeParams = useParams()
  const navigate = useNavigate()
  //****************** */
  const maxLength = 250;
  const [updatedDescription, setUpdatedDescription] = useState(data.description);
  const list = useSelector((state) => state.products.products[routeParams.productId])

  const handleDescriptionChange = (newValue) => {
    setUpdatedDescription(newValue);
  };
//******************** */

  // const deleteConfirm = (id) => {
  //   setCurrentId(id)
  //   setConfirm(true)
  // }
  // const deleteFeature = async () => {
  //   await deleteFeature({ id: currentId })
  //   navigate(`/products`)
  // }
  const handleDeleteFeature = async (productId,featureId) => {
    try {
      await deleteFeatureReq(productId, { id: featureId });
      navigate(`/products/${productId}`)
      dispatch( storeFeatureDelete({ productId, featureId }));
      
    } catch (error) {
      console.error('Error deleting feature:', error);
    }
  }
  useEffect(() => {
    ;(async () => {
      setPlanData(data)
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

                    {/* <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Description" />
                      </td>
                      <td>{data.client.name}</td>
                    </tr> */}
                    {console.log(data)}
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Date" />
                      </td>
                      <td>
                        <TableDate
                          createdDate={data.createdDate}
                          editedDate={data.editedDate}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Type" />
                      </td>
                      <td>{featureTypeMap[data.type]}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Unit" />
                      </td>
                      <td>{featureUnitMap[data.unit]}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Reset" />
                      </td>
                      <td>{featureResetMap[data.reset]}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Description" />
                      </td>
                      <td>
                      <TextareaAndCounter
                        value={updatedDescription}
                        onValueChange={handleDescriptionChange}
                        maxLength={maxLength}
                        // showCharCount
                      />
                      </td>
                    </tr>

                    {/* <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Api-key" />
                      </td>
                      <td className="apikeyTd">
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
                    </tr> */}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <div className="action">
              <Button
                className="mr-3"
                label={<FormattedMessage id="Delete" />}
                icon="pi pi-trash"
                onClick={() => handleDeleteFeature(routeParams.productId,routeParams.id)}
                style={{
                  backgroundColor: 'var(--red)',
                  borderColor: 'var(--red)',
                }}
                
              />
              <DeleteConfirmation
              message={
                <FormattedMessage id="delete-plan-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={ handleDeleteFeature}
              sideBar={false}
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

            <ThemeDialog visible={visible} setVisible={setVisible}>
              <FeatureForm
                productId={routeParams.productId}
                FeatureData={list}
                 setUpdate={setUpdate}
                dispatch={dispatch}
                 FeatureInfo={FeatureInfo}

                featureData={list?.features[routeParams.id]}
                type={'edit'}
                visible={visible}
                planData={data}
                setVisible={setVisible}
                popupLabel={<FormattedMessage id="Edit-Feature" />}
              />
            </ThemeDialog>
          </div>
        </div>
      )}
    </Wrapper>
  )
}

export default FeatureDetailsTab
