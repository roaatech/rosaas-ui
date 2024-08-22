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
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
} from 'react-icons/md'

export default function CurrenciesPage() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [currencyDetails, setCurrencyDetails] = useState(null)
  const { getCurrencies, getCurrencyById, deleteCurrency, publishCurrency } =
    useRequest()
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

  const processedData = useMemo(() => {
    return (
      listData &&
      Object.values(listData)?.map((currency) => ({
        ...currency,
      }))
    )
  }, [listData])

  return (
    <Wrapper>
      {/* <BreadcrumbComponent breadcrumbInfo="CurrenciesList" /> */}
      <div className="main-container">
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
                      <Dropdown.Item onClick={() => navigate(`./${data.id}`)}>
                        <FontAwesomeIcon icon={faEdit} className="mx-2" />
                        <FormattedMessage id="Edit" />
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCurrentId(data.id)
                          deleteCurrencyFun()
                        }}
                        className="text-danger"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                        <FormattedMessage id="Delete" />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                style={{ width: '60px', textAlign: 'center' }}
                header={<FormattedMessage id="Actions" />}
              />
            </DataTable>
            <ThemeDialog visible={visible} setVisible={setVisible}>
              {currencyDetails && (
                <ShowDetails
                  popupLabel={<FormattedMessage id="Currency-Details" />}
                  data={currencyDetails}
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
