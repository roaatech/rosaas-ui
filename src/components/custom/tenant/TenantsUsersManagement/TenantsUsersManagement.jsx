import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisH,
  faEdit,
  faSyncAlt,
  faBan,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  ButtonGroup,
  Card,
  Table,
  Button,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { Wrapper } from './TenantsUsersManagement.styled'
import { BsPlusCircleFill } from 'react-icons/bs'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'

import Label from '../../Shared/label/Label'
import { isMajorStatus } from '../../../../const/product'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'

import { formatDate } from '../../../../lib/sharedFun/Time'

import { useParams } from 'react-router-dom'
import {
  AdminPrivileges,
  AdminPrivilegesChangeAttr,
  deleteTenantAdminPrivileges,
} from '../../../../store/slices/tenants'
import { Owner } from '../../../../const'
import { MdPersonAdd, MdPersonAddDisabled } from 'react-icons/md'

const TenantsUsersManagement = () => {
  const tenantData = useSelector((state) => state.tenants.tenants)

  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')

  const { EntityAdminPrivileges, deleteAdminPrivileges, userIsMajor } =
    useRequest()
  const dispatch = useDispatch()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const [update, setUpdate] = useState(0)
  const params = useParams()
  const tenantId = params.id
  const data = tenantData[tenantId]?.AdminPrivileges
  useEffect(() => {
    ;(async () => {
      const listData = await EntityAdminPrivileges(tenantId)
      dispatch(
        AdminPrivileges({
          id: tenantId,
          data: listData?.data.data,
        })
      )
    })()
  }, [update, tenantId])

  const handleDeleteSecret = async () => {
    await deleteAdminPrivileges({ id: currentId })
    dispatch(deleteTenantAdminPrivileges({ tenantId, itemId: currentId }))
  }
  const toggleIsMajor = async (id, isMajor) => {
    // await userIsMajor(tenantId, {
    //   id,
    //   isMajor: !isMajor,
    // })

    dispatch(
      AdminPrivilegesChangeAttr({
        tenantId,
        itemId: id,
        attr: 'isMajor',
        value: !isMajor,
      })
    )
  }

  const TableRow = (props) => {
    const { email, isMajor, createdDate, id, userType } = props

    return (
      <>
        <tr>
          <td>
            <span className="fw-normal">{email}</span>
          </td>
          <td>
            <span className="fw-normal">
              {Owner?.[userType] && <FormattedMessage id={Owner[userType]} />}
            </span>
          </td>

          <td>
            <span className="fw-normal">
              {<Label {...isMajorStatus[isMajor]} />}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {createdDate && formatDate(createdDate)}
            </span>
          </td>

          <td>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                as={Button}
                split
                variant="link"
                className="text-dark m-0 p-0"
              >
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => toggleIsMajor(id, isMajor)}>
                  {isMajor ? (
                    <span className=" ">
                      <MdPersonAddDisabled className="mx-2" />{' '}
                      <FormattedMessage id="Deauthorize" />
                    </span>
                  ) : (
                    <span className=" ">
                      <MdPersonAdd className="mx-2" />
                      <FormattedMessage id="Authorize" />
                    </span>
                  )}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => deleteConfirm(id)}
                  className="text-danger"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                  <FormattedMessage id="Delete" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      </>
    )
  }
  return (
    <Wrapper>
      <div className="dynamicButtons pt-0 mt-0 mb-1">
        <DynamicButtons
          buttons={[
            {
              popupLabel: <FormattedMessage id="Create-New-User" />,
              order: 1,
              type: 'form',
              label: 'New-User',
              component: 'createTenantUser',
              currentUser: true,
              icon: <BsPlusCircleFill />,
              formType: 'create',
              update,
              setUpdate,
            },
            {
              popupLabel: <FormattedMessage id="Add-New-User" />,
              order: 4,
              type: 'form',
              label: 'Add-User',
              component: 'createTenantUser',
              icon: <BsPlusCircleFill />,
              formType: 'add',
              update,
              currentUser: false,
              setUpdate,
            },
          ]}
        />
      </div>
      <div className="border-top-1 border-light p-0" />

      <Table hover className="user-table align-items-center">
        <thead>
          <tr>
            <th className="border-bottom">
              <FormattedMessage id="Email" />
            </th>
            <th className="border-bottom">
              <FormattedMessage id="User-Type" />
            </th>
            <th className="border-bottom">
              <FormattedMessage id="Status" />
            </th>

            <th className="border-bottom">
              <FormattedMessage id="Created-Date" />
            </th>

            <th className="border-bottom">
              <FormattedMessage id="Actions" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data && Object.values(data).length
            ? Object.values(data).map((t, index) => {
                if (t != undefined) {
                  return <TableRow key={index} {...t} />
                }
              })
            : null}
        </tbody>
      </Table>
      <DeleteConfirmation
        message={<FormattedMessage id="remove-user-message" />}
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={handleDeleteSecret}
        sideBar={false}
      />
    </Wrapper>
  )
}

export default TenantsUsersManagement
