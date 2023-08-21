import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table } from '@themesberg/react-bootstrap'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsFillPersonLinesFill } from 'react-icons/bs'
import { TabView, TabPanel } from 'primereact/tabview'
import ChildTable from '../../components/custom/tenant/ChildTable/ChildTable'
import { Button } from 'primereact/button'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation'
import useRequest from '../../axios/apis/useRequest'
import TenantForm from '../../components/custom/tenant/TenantForm/TenantForm'
import { Wrapper } from './TenantDetails.styled'
import Actions from '../../components/custom/tenant/Actions/Actions'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import { useDispatch, useSelector } from 'react-redux'
import { tenantInfo } from '../../store/slices/tenants'
import { removeTenant, setActiveIndex } from '../../store/slices/tenants'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { DataTransform } from '../../lib/sharedFun/Time'
import { FormattedMessage } from 'react-intl'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'

let firstLoad = 0
const TenantDetails = () => {
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [updateDetails, setUpdateDetails] = useState(0)
  const [visible, setVisible] = useState(false)

  const tenantsData = useSelector((state) => state.tenants.tenants)
  const activeIndex = useSelector((state) => state.tenants.currentTab)
  const { getTenant, deleteTenantReq, editTenantStatus } = useRequest()
  const routeParams = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const updateTenant = async () => {
    await dispatch(removeTenant(routeParams.id))
    setUpdateDetails(updateDetails + 1)
  }

  const chagneStatus = async (actionStatus) => {
    await editTenantStatus({
      TenantId: routeParams.id,
      status: actionStatus,
    })
    updateTenant()
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const deleteTenant = async () => {
    await deleteTenantReq({ id: currentId })
    dispatch(removeTenant(routeParams.id))
    navigate(`/Dashboard`)
  }

  let tenantObject = tenantsData[routeParams.id]

  let tenantStatus = tenantObject?.products[0]?.actions
    ? tenantObject?.products
        ?.flatMap((item) => item?.actions?.map((action) => action))
        .filter(
          (obj, index, self) =>
            self.findIndex((o) => o?.status === obj?.status) === index
        )
    : null

  tenantObject?.products.map((item, index) => {
    if (firstLoad == 0 && item?.name == window.location.href.split('#')[1]) {
      dispatch(setActiveIndex(index + 1))
      firstLoad++
    }
  })

  useEffect(() => {
    ;(async () => {
      if (!tenantsData[routeParams.id]?.products[0]?.status) {
        const tenantData = await getTenant(routeParams.id)
        dispatch(tenantInfo(tenantData.data.data))
      }
    })()
  }, [visible, routeParams.id, updateDetails])
  useEffect(() => {
    return () => dispatch(setActiveIndex(0))
  }, [routeParams.id])

  return (
    <Wrapper>
      {tenantObject && (
        <BreadcrumbComponent
          breadcrumbInfo={'TenantDetails'}
          param1={tenantObject.id}
          icon={BsFillPersonLinesFill}
        />
      )}

      <div className="main-container">
        {tenantObject && (
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Tenant-Details" />:{' '}
              {tenantObject.uniqueName}
            </h4>
            <DynamicButtons
              buttons={
                tenantStatus && tenantStatus[0]?.status != 13
                  ? [
                      {
                        order: 1,
                        type: 'form',
                        id: routeParams.id,
                        label: 'Edit-Tenant',
                        component: 'editTenant',
                        updateTenant: updateTenant,
                      },
                    ]
                  : []
              }
            />
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
                    <TabPanel header={<FormattedMessage id="Details" />}>
                      <Card border="light" className="shadow-sm border-0">
                        <Card.Body className="p-0">
                          <Table
                            responsive
                            className="table-centered table-nowrap rounded mb-0"
                          >
                            <tbody>
                              <tr>
                                <td className="fw-bold">
                                  <FormattedMessage id="Title" />
                                </td>
                                <td>{tenantObject.title}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">
                                  <FormattedMessage id="Unique-Name" />
                                </td>
                                <td>{tenantObject.uniqueName}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">
                                  <FormattedMessage id="Products" />
                                </td>
                                <td>
                                  {tenantObject.products.map(
                                    (product, index) => (
                                      <span
                                        key={index}
                                        className="p-1 border-round border-1 border-400 me-2"
                                      >
                                        {product?.name}
                                      </span>
                                    )
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td className="fw-bold">
                                  <FormattedMessage id="Created-Date" />
                                </td>
                                <td>
                                  {DataTransform(tenantObject.createdDate)}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-bold">
                                  <FormattedMessage id="Last-Updated-Date" />
                                </td>
                                <td>
                                  {DataTransform(tenantObject.editedDate)}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                      <div className="buttons">
                        <div className="action">
                          {/* {tenantStatus && tenantStatus[0]?.status != 13 ? (
                            <Button
                              className="mr-3"
                              label={<FormattedMessage id="Edit" />}
                              icon="pi pi-pencil"
                              onClick={() => setVisible(true)}
                              style={{
                                backgroundColor: 'var(--primary-color)',
                                borderColor: 'var(--primary-color)',
                              }}
                            />
                          ) : null} */}

                          <Actions
                            tenantData={tenantObject}
                            actions={tenantStatus}
                            deleteConfirm={deleteConfirm}
                            chagneStatus={chagneStatus}
                          />
                        </div>
                      </div>
                    </TabPanel>
                    {tenantObject.products.map((product, index) => (
                      <TabPanel
                        header={product?.name.toUpperCase()}
                        key={index}
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

                  <ThemeDialog visible={visible} setVisible={setVisible}>
                    <TenantForm
                      popupLabel={<FormattedMessage id="Edit-Tenant" />}
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
