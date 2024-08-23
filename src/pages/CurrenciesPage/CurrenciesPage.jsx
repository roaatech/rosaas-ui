import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Wrapper } from './CurrenciesPage.styled'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import useRequest from '../../axios/apis/useRequest'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import ShowDetails from '../../components/custom/Shared/ShowDetails/ShowDetails'
import {
  currencyChangeAttr,
  removeCurrency,
  setAllCurrencies,
} from '../../store/slices/products/currenciesSlice'
import Label from '../../components/custom/Shared/label/Label'
import { PublishStatus } from '../../const'
import {
  MdAttachMoney,
  MdMoneyOff,
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
  MdStar,
  MdStarBorder,
} from 'react-icons/md'
import {
  PrimaryCurrencyStatus,
  PrimaryExchangeRateCurrencyStatus,
} from '../../const/const'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import CurrencyForm from '../../components/custom/Currency/CurrencyForm'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'

export default function CurrenciesPage() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [currencyDetails, setCurrencyDetails] = useState(null)
  const [editVisible, setEditVisible] = useState(false)
  const {
    getCurrencies,
    getCurrencyById,
    deleteCurrency,
    publishCurrency,
    markAsPrimaryCurrency,
    markAsPrimaryCurrencyForProductOwner,
    markAsPrimaryExchangeRateCurrency,
    markAsPrimaryExchangeRateCurrencyForProductOwner,
  } = useRequest()
  const navigate = useNavigate()

  const listData = useSelector((state) => state?.currenciesSlice?.currencies)

  useEffect(() => {
    const fetchCurrencies = async () => {
      const response = await getCurrencies()
      console.log(response?.data.data)

      if (response?.data.data) {
        dispatch(setAllCurrencies(response.data.data))
      }
    }

    fetchCurrencies()
  }, [])

  const handleViewDetails = async (id) => {
    const response = await getCurrencyById(id)
    if (response?.data.data) {
      setCurrencyDetails(response.data.data)
      setVisible(true)
    }
  }

  const deleteCurrencyFun = async () => {
    const response = await deleteCurrency(currentId)
    if (response?.status === 200) {
      dispatch(removeCurrency(currentId))
    }
  }
  const togglePublishCurrency = async (id, isPublished) => {
    try {
      // Prepare the data with the opposite value of isPublished
      const data = { isPublished: !isPublished }

      // Send the request
      const response = await publishCurrency(id, data)

      if (response?.status === 200) {
        // Update the Redux state to reflect the change
        dispatch(
          currencyChangeAttr({
            currencyId: id,
            attributes: { isPublished: !isPublished },
          })
        )
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error)
    }
  }
  let userInfo = useSelector((state) => state.auth.userInfo)
  let userRole = userInfo.userType

  // Extract the ProductOwnerInfo ID if the user is a product owner
  let productOwnerId = userInfo.ProductOwnerInfo?.id
  const togglePrimaryCurrency = async (id, isPrimary) => {
    try {
      let response

      if (userRole === 'productOwner' && productOwnerId) {
        // Use the product owner-specific endpoint
        response = await markAsPrimaryCurrencyForProductOwner(
          productOwnerId,
          id
        )
      } else if (userRole === 'superAdmin') {
        // Use the super admin-specific endpoint
        response = await markAsPrimaryCurrency(id)
      }

      if (response?.status === 200) {
        // Update the Redux state to reflect the change
        dispatch(
          currencyChangeAttr({
            currencyId: id,
            attributes: { isPrimaryCurrency: !isPrimary },
          })
        )
      }
    } catch (error) {
      console.error('Failed to toggle primary currency status:', error)
    }
  }

  const togglePrimaryExchangeRateCurrency = async (id, isPrimary) => {
    try {
      let response

      if (userRole === 'productOwner' && productOwnerId) {
        // Use the product owner-specific endpoint
        response = await markAsPrimaryExchangeRateCurrencyForProductOwner(
          productOwnerId,
          id
        )
      } else if (userRole === 'superAdmin') {
        // Use the super admin-specific endpoint
        response = await markAsPrimaryExchangeRateCurrency(id)
      }

      if (response?.status === 200) {
        // Update the Redux state to reflect the change
        dispatch(
          currencyChangeAttr({
            currencyId: id,
            attributes: { isPrimaryExchangeRateCurrency: !isPrimary },
          })
        )
      }
    } catch (error) {
      console.error(
        'Failed to toggle primary exchange rate currency status:',
        error
      )
    }
  }

  const processedData = useMemo(() => {
    return (
      listData &&
      Object.values(listData)?.map((currency) => ({
        ...currency,
      }))
    )
  }, [listData])
  const [visibleHead, setVisibleHead] = useState(false)
  const handleEditCurrency = async (id) => {
    const response = await getCurrencyById(id)
    if (response?.data.data) {
      setCurrencyDetails(response.data.data)
      setEditVisible(true)
      setCurrentId(id)
    }
  }
  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo="CurrenciesList" />
      <div className="main-container">
        <TableHead
          label={<FormattedMessage id="Add-Currency" />}
          icon={'pi-money-bill'}
          search={false}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          title={<FormattedMessage id="Currencies-List" />}
        >
          {userRole === 'superAdmin' && (
            <CurrencyForm
              popupLabel={<FormattedMessage id="Create-Currency" />}
              type={'create'}
              visible={visibleHead}
              setVisible={setVisibleHead}
            />
          )}
        </TableHead>
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <DataTable
              value={processedData}
              tableStyle={{ minWidth: '50rem' }}
              size="small"
            >
              <Column field="displayName" header="Currency Name" />
              <Column field="currencyCode" header="Currency Code" />
              <Column field="rate" header="Rate" />
              <Column field="displayOrder" header="Display Order" />
              <Column
                field="isPrimaryCurrency"
                header="Primary Currency"
                body={(data) => (
                  <Label
                    {...PrimaryCurrencyStatus[
                      data.isPrimaryCurrency ? true : false
                    ]}
                  />
                )}
              />
              <Column
                field="isPrimaryExchangeRateCurrency"
                header="Primary Exchange Rate Currency"
                body={(data) => (
                  <Label
                    {...PrimaryExchangeRateCurrencyStatus[
                      data.isPrimaryExchangeRateCurrency ? true : false
                    ]}
                  />
                )}
              />
              <Column
                body={(data) => {
                  return (
                    <span>
                      <Label
                        {...PublishStatus[data.isPublished ? true : false]}
                      />
                    </span>
                  )
                }}
                header="Published"
              />
              <Column
                body={(data) => (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      as={Button}
                      split
                      variant="link"
                      className="text-dark m-0 p-0"
                    >
                      <span className="icon icon-sm">
                        <FontAwesomeIcon
                          icon={faEllipsisH}
                          className="icon-dark"
                        />
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleViewDetails(data.id)}>
                        <FontAwesomeIcon icon={faEye} className="mx-2" />
                        <FormattedMessage id="View-Details" />
                      </Dropdown.Item>
                      {userRole === 'superAdmin' && (
                        <Dropdown.Item
                          onClick={() => handleEditCurrency(data.id)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="mx-2" />
                          <FormattedMessage id="Edit" />
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        onClick={() =>
                          togglePrimaryCurrency(data.id, data.isPrimaryCurrency)
                        }
                      >
                        {data.isPrimaryCurrency ? (
                          <span className=" ">
                            <MdStarBorder className="mx-2" />
                            <FormattedMessage id="Unmark-Primary-Currency" />
                          </span>
                        ) : (
                          <span className=" ">
                            <MdStar className="mx-2" />
                            <FormattedMessage id="Mark-Primary-Currency" />
                          </span>
                        )}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          togglePrimaryExchangeRateCurrency(
                            data.id,
                            data.isPrimaryExchangeRateCurrency
                          )
                        }
                      >
                        {data.isPrimaryExchangeRateCurrency ? (
                          <span className=" ">
                            <MdMoneyOff className="mx-2" />
                            <FormattedMessage id="Unmark-Primary-Exchange-Rate" />
                          </span>
                        ) : (
                          <span className=" ">
                            <MdAttachMoney className="mx-2" />
                            <FormattedMessage id="Mark-Primary-Exchange-Rate" />
                          </span>
                        )}
                      </Dropdown.Item>
                      {userRole === 'superAdmin' && (
                        <>
                          <Dropdown.Item
                            onClick={() =>
                              togglePublishCurrency(data.id, data.isPublished)
                            }
                          >
                            {data.isPublished ? (
                              <span className=" ">
                                <MdOutlineUnpublished className="mx-2" />
                                <FormattedMessage id="Unpublished" />
                              </span>
                            ) : (
                              <span className=" ">
                                <MdOutlinePublishedWithChanges className="mx-2" />
                                <FormattedMessage id="Published" />
                              </span>
                            )}
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={() => {
                              setCurrentId(data.id)
                              deleteCurrencyFun()
                            }}
                            className="text-danger"
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="mx-2"
                            />
                            <FormattedMessage id="Delete" />
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                style={{ width: '60px', textAlign: 'center' }}
                header={<FormattedMessage id="Actions" />}
              />
            </DataTable>
            <ThemeDialog visible={editVisible} setVisible={setEditVisible}>
              {currencyDetails && (
                <CurrencyForm
                  popupLabel={<FormattedMessage id="Edit-Currency" />}
                  type={'edit'}
                  visible={editVisible}
                  setVisible={setEditVisible}
                  currentId={currentId}
                />
              )}
            </ThemeDialog>
            <ThemeDialog visible={visible} setVisible={setVisible}>
              {currencyDetails && (
                <ShowDetails
                  popupLabel={<FormattedMessage id="Currency-Details" />}
                  data={{
                    displayName: currencyDetails.displayName,
                    currencyCode: currencyDetails.currencyCode,
                    rate: currencyDetails.rate,
                    customFormatting: currencyDetails.customFormatting,
                    isPublished: currencyDetails?.isPublished
                      ? 'true'
                      : 'false',
                    displayOrder: currencyDetails.displayOrder,
                    roundingType: currencyDetails.roundingType,
                    createdDate: currencyDetails.createdDate,
                    editedDate: currencyDetails.editedDate,
                  }}
                  setVisible={setVisible}
                />
              )}
            </ThemeDialog>
          </Card.Body>
        </Card>
      </div>
    </Wrapper>
  )
}
