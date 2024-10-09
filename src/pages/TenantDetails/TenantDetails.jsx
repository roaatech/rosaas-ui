import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table } from '@themesberg/react-bootstrap'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsFillPersonLinesFill } from 'react-icons/bs'
import { TabView, TabPanel } from 'primereact/tabview'
import ChildTable from '../../components/custom/tenant/ChildTable/ChildTable'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation'
import useRequest from '../../axios/apis/useRequest'
import TenantForm from '../../components/custom/tenant/TenantForm/TenantForm'
import { Wrapper } from './TenantDetails.styled'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import { useDispatch, useSelector } from 'react-redux'
import { subscriptionData, tenantInfo } from '../../store/slices/tenants'
import { removeTenant, setActiveIndex } from '../../store/slices/tenants'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { DataTransform } from '../../lib/sharedFun/Time'
import { FormattedMessage, useIntl } from 'react-intl'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'
import { AiFillEdit } from 'react-icons/ai'
import useActions from '../../components/custom/tenant/Actions/Actions'
import { featureUnitMap, statusConst } from '../../const'

import { featureResetMap } from '../../const'
import NoteInputConfirmation from '../../components/custom/Shared/NoteInputConfirmation/NoteInputConfirmation'
import { MdFactCheck } from 'react-icons/md'
import TenantsUsersManagement from '../../components/custom/tenant/TenantsUsersManagement/TenantsUsersManagement'
import Label from '../../components/custom/Shared/label/Label'
import TrialLabel from '../../components/custom/tenant/TrialLabel/TrialLabel'
import { Routes } from '../../routes'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

let firstLoad = 0
const TenantDetails = () => {
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [updateDetails, setUpdateDetails] = useState(0)
  const [visible, setVisible] = useState(false)
  let direction = useSelector((state) => state.main.direction)

  const tenantsData = useSelector((state) => state.tenants.tenants)

  const activeIndex = useSelector((state) => state.tenants.currentTab)
  const { getTenant, deleteTenantReq, editTenantStatus, subscriptionDetails } =
    useRequest()
  const routeParams = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { renderActions } = useActions()
  const updateTenant = async () => {
    await dispatch(removeTenant(routeParams.id))
    setUpdateDetails(updateDetails + 1)
  }
  const [status, setStatus] = useState()
  const chagneStatus = async (data, comment) => {
    await editTenantStatus({
      TenantId: routeParams.id,
      status: data?.status,
      actionType: data?.actionType,
      comment: comment,
    })
    updateTenant()
  }
  const statusConfirm = (status, actionType) => {
    setConfirm(true)
    setStatus({ status, actionType })
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const deleteTenant = async () => {
    await deleteTenantReq({ id: currentId })
    dispatch(removeTenant(routeParams.id))
    navigate(Routes.Dashboard.path)
  }

  let tenantObject = tenantsData[routeParams.id]
  let tenantStatus = tenantObject?.subscriptions[0]?.actions
    ? tenantObject?.subscriptions
        ?.flatMap((item) => item?.actions?.map((action) => action))
        .filter(
          (obj, index, self) =>
            self.findIndex((o) => o?.status === obj?.status) === index
        )
    : null

  tenantObject?.subscriptions.map((item, index) => {
    if (firstLoad == 0 && item?.name == window.location.href.split('#')[1]) {
      dispatch(setActiveIndex(index + 1))
      firstLoad++
    }
  })

  const intl = useIntl()

  useEffect(() => {
    ;(async () => {
      if (!tenantsData[routeParams.id]?.subscriptions[0]?.status) {
        const tenantData = await getTenant(routeParams.id)
        dispatch(tenantInfo(tenantData.data.data))
      }
    })()
  }, [visible, routeParams.id, updateDetails])

  useEffect(() => {
    return () => dispatch(setActiveIndex(0))
  }, [routeParams.id, dispatch])

  return (
    <Wrapper direction={direction}>
      {tenantObject && (
        <BreadcrumbComponent
          breadcrumbInfo={'TenantDetails'}
          param1={tenantObject.id}
          icon={BsFillPersonLinesFill}
          data={{ name: tenantObject.systemName }}
        />
      )}

      <div className="main-container">
        {tenantObject && (
          <UpperContent>
            <h4 className="m-0">
              <SafeFormatMessage id="Tenant-Details" />:{' '}
              {tenantObject.displayName}
            </h4>
          </UpperContent>
        )}

        {tenantObject && tenantStatus && (
          <div className="pageWrapper">
            <div className="tableSec">
              <div className="main">
                <div className="details">
                  <TabView
                    className="card"
                    activeIndex={activeIndex}
                    onTabChange={(e) => {
                      dispatch(setActiveIndex(e.index))
                    }}
                  >
                    <TabPanel header={<SafeFormatMessage id="Details" />}>
                      <div className="row-button ">
                        <div className="dynamicButtons">
                          <DynamicButtons
                            buttons={
                              tenantStatus && tenantStatus[0]?.status !== 13
                                ? [
                                    {
                                      order: 1,
                                      type: 'form',
                                      id: routeParams.id,
                                      label: 'Edit',
                                      component: 'editTenant',
                                      updateTenant: updateTenant,
                                      icon: <AiFillEdit />,
                                    },
                                    ...renderActions(
                                      tenantObject,
                                      tenantStatus,
                                      chagneStatus,
                                      statusConfirm,
                                      deleteConfirm
                                    ),
                                  ]
                                : renderActions(
                                    tenantObject,
                                    tenantStatus,
                                    chagneStatus,
                                    statusConfirm,
                                    deleteConfirm
                                  )
                            }
                          />
                        </div>
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
                                  <SafeFormatMessage id="Display-Name" />
                                </td>
                                <td className=" line-cell">
                                  {tenantObject.displayName}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-bold">
                                  <SafeFormatMessage id="System-Name" />
                                </td>
                                <td>{tenantObject.systemName}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">
                                  <SafeFormatMessage id="Products" />
                                </td>
                                <td>
                                  {tenantObject.subscriptions.map(
                                    (subscription, index) => (
                                      <span
                                        key={index}
                                        className="p-1 border-round border-1 border-400 mx-2"
                                      >
                                        {subscription?.product.systemName}
                                      </span>
                                    )
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td className="fw-bold">
                                  <SafeFormatMessage id="Created-Date" />
                                </td>
                                <td>
                                  {DataTransform(tenantObject.createdDate)}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-bold">
                                  <SafeFormatMessage id="Last-Updated-Date" />
                                </td>
                                <td>
                                  {DataTransform(tenantObject.editedDate)}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </TabPanel>
                    {/* <TabPanel
                      header={
                        <SafeFormatMessage id="Tenants-Users-Management" />
                      }
                    >
                      <TenantsUsersManagement />
                    </TabPanel> */}
                    {tenantObject?.subscriptions?.map((product, index) => (
                      <TabPanel
                        key={index}
                        header={
                          <>
                            <div className="tab-header">
                              {product?.product.systemName?.toUpperCase()}
                              {product?.subscriptionMode === 2 && (
                                <TrialLabel />
                              )}
                            </div>
                          </>
                        }
                      >
                        <ChildTable
                          tenantDetails={tenantObject}
                          tenantId={tenantObject.id}
                          productData={product}
                          updateDetails={updateDetails}
                          updateTenant={updateTenant}
                          productIndex={index}
                        />
                      </TabPanel>
                    ))}
                  </TabView>
                  <DeleteConfirmation
                    message="Do you want to delete this Tenant?"
                    icon="pi pi-exclamation-triangle"
                    confirm={confirm}
                    setConfirm={setConfirm}
                    confirmFunction={deleteTenant}
                    sideBar={true}
                  />

                  {status && (
                    <NoteInputConfirmation
                      confirm={confirm}
                      setConfirm={setConfirm}
                      confirmFunction={chagneStatus}
                      message={intl.formatMessage({
                        id:
                          statusConst[status]?.status?.message ||
                          'default-status-message',
                      })}
                      data={status}
                      placeholder={intl.formatMessage({ id: 'Comment' })}
                    />
                  )}
                  <ThemeDialog visible={visible} setVisible={setVisible}>
                    <TenantForm
                      popupLabel={<SafeFormatMessage id="Edit-Tenant" />}
                      type={'edit'}
                      tenantData={tenantObject}
                      setVisible={setVisible}
                      sideBar={true}
                      updateTenant={updateTenant}
                    />
                  </ThemeDialog>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}

export default TenantDetails
