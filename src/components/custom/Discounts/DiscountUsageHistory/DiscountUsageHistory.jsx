import React, { useEffect, useState } from 'react'
import { Wrapper } from './DiscountUsageHistory.styled'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import {
  DataTransform,
  UppercaseMonthDateFormat,
} from '../../../../lib/sharedFun/Time'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { current } from '@reduxjs/toolkit'
import useRequest from '../../../../axios/apis/useRequest'
import {
  deleteDiscountHistory,
  setDiscountHistory,
} from '../../../../store/slices/discountsSlice'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { BsFillTrash3Fill } from 'react-icons/bs'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import CustomPaginator from '../../Shared/CustomPaginator/CustomPaginator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

const DiscountUsageHistory = () => {
  const dispatch = useDispatch()
  const {
    getDiscountUsageHistoriesByDiscountId,
    deleteDiscountUsageHistoriesById,
  } = useRequest()
  const currentId = useParams().id
  const usageHistories = useSelector(
    (state) => state.discountsSlice.discounts?.[currentId]?.usageHistories
  )
  const [confirm, setConfirm] = useState(false)
  const [first, setFirst] = useState(0) // For pagination
  const [rows, setRows] = useState(10) // Rows per page
  const [totalCount, setTotalCount] = useState(0)

  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }
  const handleDeleteHistory = async () => {
    await deleteDiscountUsageHistoriesById(currentHistoryId)
    dispatch(deleteDiscountHistory({ id: currentId }))
    setConfirm(false)
  }
  useEffect(() => {
    if (!currentId) {
      return
    }

    const fetchUsageHistories = async () => {
      try {
        const response = await getDiscountUsageHistoriesByDiscountId(
          currentId,
          `?page=${Math.ceil((first + 1) / rows)}&pageSize=${rows}`
        )
        if (response?.data) {
          dispatch(
            setDiscountHistory({ id: currentId, data: response.data.data })
          )
          setTotalCount(response.data.data.totalCount)
        }
      } catch (error) {
        console.error('Failed to fetch usage histories', error)
      }
    }
    fetchUsageHistories()
  }, [currentId, first, rows])
  return (
    <Wrapper>
      <Card border="light" className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th>
                  <SafeFormatMessage id="Order-Number" />
                </th>
                <th>
                  <SafeFormatMessage id="Creation-Date" />
                </th>
              </tr>
            </thead>
            <tbody>
              {usageHistories &&
                Object.values(usageHistories).map((history, index) => (
                  <tr key={index}>
                    <td>{history.orderId}</td>
                    <td>
                      {history.creationDate && (
                        <DataLabelWhite
                          text={UppercaseMonthDateFormat(
                            history.creationDate,
                            true
                          )}
                        />
                      )}
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                          as={Button}
                          split
                          variant="link"
                          className="text-dark m-0"
                        >
                          <span className="icon icon-sm">
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="icon-dark"
                            />
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setCurrentHistoryId(history.id)
                              setConfirm(true)
                            }}
                          >
                            <BsFillTrash3Fill className="mx-2 text-danger" />
                            <SafeFormatMessage id="Delete" />
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <CustomPaginator
            first={first}
            rows={rows}
            totalCount={totalCount}
            onPageChange={onPageChange}
          />
        </Card.Body>
      </Card>
      <DeleteConfirmation
        message={<SafeFormatMessage id="delete-confirmation-message" />}
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={handleDeleteHistory}
        sideBar={false}
      />
    </Wrapper>
  )
}

export default DiscountUsageHistory
