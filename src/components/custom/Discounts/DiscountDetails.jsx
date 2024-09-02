import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../../axios/apis/useRequest'
import { removeDiscount } from '../../../store/slices/discountsSlice'
import { Wrapper } from './DiscountDetails.styled'
import UpperContent from '../Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DynamicButtons from '../Shared/DynamicButtons/DynamicButtons'
import { AiFillEdit } from 'react-icons/ai'
import { BsFillTrash3Fill } from 'react-icons/bs'
import { TabPanel, TabView } from 'primereact/tabview'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'
import { DataTransform } from '../../../lib/sharedFun/Time'
import DeleteConfirmation from '../global/DeleteConfirmation/DeleteConfirmation'
import BreadcrumbComponent from '../Shared/Breadcrumb/Breadcrumb'
import Label from '../Shared/label/Label'
import DateLabel from '../Shared/DateLabel/DateLabel'
import { labelYesNoStyle } from '../../../const/const'

const DiscountDetails = () => {
  const routeParams = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    getDiscountById,
    deleteDiscount,
    getDiscountUsageHistoriesByDiscountId,
    deleteDiscountUsageHistoriesById,
  } = useRequest()

  const [discount, setDiscount] = useState(null)
  const [usageHistories, setUsageHistories] = useState([])
  const [confirm, setConfirm] = useState(false)
  const [currentHistoryId, setCurrentHistoryId] = useState(null)

  useEffect(() => {
    fetchDiscountDetails()
  }, [routeParams.id])

  const fetchDiscountDetails = async () => {
    const discountResponse = await getDiscountById(routeParams.id)
    if (discountResponse?.data) {
      setDiscount(discountResponse.data.data)
    }

    const usageHistoriesResponse = await getDiscountUsageHistoriesByDiscountId(
      routeParams.id
    )
    if (usageHistoriesResponse?.data) {
      setUsageHistories(usageHistoriesResponse.data.data)
    }
  }

  const handleDeleteDiscount = async () => {
    await deleteDiscount(routeParams.id)
    dispatch(removeDiscount(routeParams.id))
    navigate('/discounts') // Adjust the path as needed
  }

  const handleDeleteHistory = async () => {
    await deleteDiscountUsageHistoriesById(currentHistoryId)
    setUsageHistories(usageHistories.filter((h) => h.id !== currentHistoryId))
    setConfirm(false)
  }
  const discountTypeOptions = [
    { value: 1, label: 'Assigned to Plans' },
    { value: 2, label: 'Assigned to Products' },
    { value: 3, label: 'Assigned to Products Owners' },
    { value: 4, label: 'Assigned to Order Total' },
    { value: 5, label: 'Assigned to Order SubTotal' },
  ]
  const discountLimitationOptions = [
    { value: 1, label: 'Unlimited' },
    { value: 2, label: 'N Times Only' },
    { value: 3, label: 'N Times Per Customer' },
  ]
  return (
    <Wrapper>
      {discount && (
        <BreadcrumbComponent
          breadcrumbInfo={'DiscountDetails'}
          data={{ name: discount.displayName }}
        />
      )}

      {discount && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Discount-Details" /> :{' '}
              {discount.displayName}
            </h4>
            <DynamicButtons
              buttons={[
                {
                  order: 2,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Edit',
                  component: 'editDiscount',
                  icon: <AiFillEdit />,
                  setActiveIndex: () => setActiveIndex(0),
                  discountData: discount,
                },
                {
                  order: 5,
                  type: 'delete',
                  confirmationMessage: 'delete-discount-confirmation-message',
                  id: routeParams.id,
                  navAfterDelete: '/discounts',
                  label: 'Delete-Discount',
                  request: handleDeleteDiscount,
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
                          <FormattedMessage id="Display-Name" />
                        </td>
                        <td>{discount.displayName}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Admin-Comment" />
                        </td>
                        <td>{discount.adminComment}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Discount-Type" />
                        </td>
                        <td>
                          <FormattedMessage
                            id={
                              discountTypeOptions.find(
                                (option) =>
                                  option.value === discount.discountType
                              )?.label
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Use-Percentage" />
                        </td>
                        <td>
                          <Label
                            {...labelYesNoStyle[discount?.usePercentage]}
                          />
                        </td>
                      </tr>
                      {discount.usePercentage && (
                        <tr>
                          <td className="fw-bold">
                            <FormattedMessage id="Discount-Percentage" />
                          </td>
                          <td>{discount.discountPercentage}%</td>
                        </tr>
                      )}
                      {!discount.usePercentage && (
                        <tr>
                          <td className="fw-bold">
                            <FormattedMessage id="Discount-Amount" />
                          </td>
                          <td>{discount.discountAmount}$</td>
                        </tr>
                      )}
                      {discount.usePercentage && (
                        <tr>
                          <td className="fw-bold">
                            <FormattedMessage id="Maximum-Discount-Amount" />
                          </td>
                          <td>{discount.maximumDiscountAmount}$</td>
                        </tr>
                      )}
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Start-Date" />
                        </td>
                        <td>
                          {discount.startDate && (
                            <Label
                              {...{
                                value: DataTransform(discount.startDate),
                                lighter: true,
                              }}
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="End-Date" />
                        </td>
                        <td>
                          {discount.endDate && (
                            <DateLabel
                              endDate={DataTransform(discount.endDate)}
                              formatedDate={true}
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Requires-Coupon-Code" />
                        </td>
                        <td>
                          {' '}
                          <Label
                            {...labelYesNoStyle[discount?.requiresCouponCode]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Coupon-Code" />
                        </td>
                        <td>{discount.couponCode}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Is-Cumulative" />
                        </td>
                        <td>
                          {' '}
                          <Label {...labelYesNoStyle[discount?.isCumulative]} />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Discount-Limitation" />
                        </td>
                        <td>
                          <FormattedMessage
                            id={
                              discountLimitationOptions.find(
                                (option) =>
                                  option.value === discount.discountLimitation
                              )?.label
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Limitation-Times" />
                        </td>
                        <td>{discount.limitationTimes}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Is-Active" />
                        </td>
                        <td>
                          <Label {...labelYesNoStyle[discount?.isActive]} />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Created-Date" />
                        </td>
                        <td>
                          {DataTransform(discount.createdDate).replace(
                            'T',
                            ' '
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <FormattedMessage id="Last-Updated-Date" />
                        </td>
                        <td>
                          {DataTransform(discount.editedDate).replace('T', ' ')}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </TabPanel>

            <TabPanel header={<FormattedMessage id="Usage-Histories" />}>
              <Card border="light" className="shadow-sm border-0">
                <Card.Body className="p-0">
                  <Table
                    responsive
                    className="table-centered table-nowrap rounded mb-0"
                  >
                    <thead className="thead-light">
                      <tr>
                        <th>
                          <FormattedMessage id="Used" />
                        </th>
                        <th>
                          <FormattedMessage id="Order-Number" />
                        </th>
                        <th>
                          <FormattedMessage id="Order-Total" />
                        </th>
                        <th>
                          <FormattedMessage id="Actions" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(usageHistories).map((history, index) => (
                        <tr key={index}>
                          <td>
                            {history.usedDate &&
                              DataTransform(history.usedDate).replace('T', ' ')}
                          </td>
                          <td>{history.orderNumber}</td>
                          <td>{history.orderTotal}</td>
                          <td>
                            <Dropdown as={ButtonGroup}>
                              <Dropdown.Toggle
                                as={Button}
                                split
                                variant="link"
                                className="text-dark m-0"
                              >
                                <span className="icon icon-sm">
                                  {/* <MdOutlineEllipsisH className="icon-dark" /> */}
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
                                  <FormattedMessage id="Delete" />
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </TabPanel>
          </TabView>
          <DeleteConfirmation
            message={<FormattedMessage id="delete-confirmation-message" />}
            icon="pi pi-exclamation-triangle"
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={handleDeleteHistory}
            sideBar={false}
          />
        </div>
      )}
    </Wrapper>
  )
}

export default DiscountDetails
