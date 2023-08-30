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

import { Wrapper } from './PlanDetailsTab.styled'

import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'
import PlanForm from '../PlanForm/PlanForm'
import TableDate from '../../Shared/TableDate/TableDate'

const PlanDetailsTab = ({ data }) => {
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [planData, setPlanData] = useState(data)
  const [visible, setVisible] = useState(false)

  const [code, setCode] = useState(data.apiKey)
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')

  const handleCopy = () => {
    setToolTipText('Copied')
    setTimeout(() => {
      setToolTipText('Copy-to-clipboard')
    }, 2000)
  }

  const { deletePlanReq } = useRequest()
  const routeParams = useParams()
  const navigate = useNavigate()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deletePlan = async () => {
    await deletePlanReq({ id: currentId })
    navigate(`/plans`)
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
                        <FormattedMessage id="Display-Order" />
                      </td>
                      <td>{data.displayOrder}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Description" />
                      </td>
                      <td>
                        <textarea
                          className="description-textarea"
                          readOnly
                          rows={Math.ceil(data.description.length / 60)}
                          value={data.description}
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

            {/* <div className="action">
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
                <FormattedMessage id="delete-plan-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deletePlan}
              sideBar={false}
            />

            <ThemeDialog visible={visible} setVisible={setVisible}>
              <PlanForm
                type={'edit'}
                visible={visible}
                planData={data}
                setVisible={setVisible}
                popupLabel={<FormattedMessage id="Edit Plan" />}
              />
            </ThemeDialog> */}
          </div>
        </div>
      )}
    </Wrapper>
  )
}
export default PlanDetailsTab
