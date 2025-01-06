import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../../axios/apis/useRequest'
import {
  discountInfo,
  removeDiscount,
} from '../../../store/slices/discountsSlice'
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
import {
  discountLimitations,
  discountTypes,
  entityTypes,
  labelYesNoStyle,
} from '../../../const/const'
import SafeFormatMessage from '../Shared/SafeFormatMessage/SafeFormatMessage'
import DiscountUsageHistory from './DiscountUsageHistory/DiscountUsageHistory'
import { use } from 'react'
import {
  convertObjectToOptionsArray,
  getKeyByValueWithFormattedMessage,
} from '../Shared/SharedFunctions/SharedFunctions'
import DiscountLinkedEntities from './DiscountLinkedEntities/DiscountLinkedEntities'

const DiscountDetails = () => {
  const routeParams = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { getDiscountById, deleteDiscount, deleteDiscountUsageHistoriesById } =
    useRequest()

  const currentDiscount = useSelector(
    (state) => state.discountsSlice?.discounts?.[routeParams.id]
  )
  const [usageHistories, setUsageHistories] = useState([])
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    fetchDiscountDetails()
  }, [routeParams.id])

  const fetchDiscountDetails = async () => {
    const discountResponse = await getDiscountById(routeParams.id)
    if (discountResponse?.data) {
      dispatch(
        discountInfo({ id: routeParams.id, data: discountResponse.data.data })
      )
    }
  }

  const handleDeleteDiscount = async () => {
    await deleteDiscount(routeParams.id)
    dispatch(removeDiscount(routeParams.id))
    navigate('/discounts') // Adjust the path as needed
  }
  const [entityType, setEntityType] = useState(null)
  useEffect(() => {
    if (
      !currentDiscount ||
      (currentDiscount && Object.keys(currentDiscount).length === 0)
    ) {
      return
    }
    if (currentDiscount?.discountType == discountTypes.assignedToPlans) {
      setEntityType(entityTypes.Plan)
    } else if (
      currentDiscount?.discountType == discountTypes.assignedToProducts
    ) {
      setEntityType(entityTypes.Product)
    } else if (
      currentDiscount?.discountType == discountTypes.assignedToProductOwners
    ) {
      setEntityType(entityTypes.ProductOwner)
    }
  }, [currentDiscount, currentDiscount && Object.keys(currentDiscount).length])
  const discountTypeOptions = convertObjectToOptionsArray(discountTypes)
  const discountLimitationOptions =
    convertObjectToOptionsArray(discountLimitations)
  return (
    <Wrapper>
      {currentDiscount && (
        <BreadcrumbComponent
          breadcrumbInfo={'DiscountDetails'}
          data={{ name: currentDiscount.displayName }}
        />
      )}

      {currentDiscount && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <SafeFormatMessage id="Discount-Details" /> :{' '}
              {currentDiscount.displayName}
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
                  discountData: currentDiscount,
                },
                {
                  order: 5,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Allocate-Discount',
                  component: 'allocateDiscount',
                  icon: <AiFillEdit />,
                  setActiveIndex: () => setActiveIndex(0),
                  discountData: currentDiscount,
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
            <TabPanel header={<SafeFormatMessage id="Details" />}>
              <Card border="light" className="shadow-sm border-0">
                <Card.Body className="p-0">
                  <Table
                    responsive
                    className="table-centered table-nowrap rounded mb-0"
                  >
                    <tbody>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Display-Name" />
                        </td>
                        <td>{currentDiscount.displayName}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Admin-Comment" />
                        </td>
                        <td>{currentDiscount.adminComment}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Discount-Type" />
                        </td>
                        <td>
                          {
                            discountTypeOptions.find(
                              (option) =>
                                option.value === currentDiscount.discountType
                            )?.label
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Use-Percentage" />
                        </td>
                        <td>
                          <Label
                            {...labelYesNoStyle[currentDiscount?.usePercentage]}
                          />
                        </td>
                      </tr>
                      {currentDiscount.usePercentage && (
                        <tr>
                          <td className="fw-bold">
                            <SafeFormatMessage id="Discount-Percentage" />
                          </td>
                          <td>{currentDiscount.discountPercentage}%</td>
                        </tr>
                      )}
                      {!currentDiscount.usePercentage && (
                        <tr>
                          <td className="fw-bold">
                            <SafeFormatMessage id="Discount-Amount" />
                          </td>
                          <td>{currentDiscount.discountAmount}$</td>
                        </tr>
                      )}
                      {currentDiscount.usePercentage && (
                        <tr>
                          <td className="fw-bold">
                            <SafeFormatMessage id="Maximum-Discount-Amount" />
                          </td>
                          <td>{currentDiscount.maximumDiscountAmount}$</td>
                        </tr>
                      )}
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Start-Date" />
                        </td>
                        <td>
                          {currentDiscount.startDate && (
                            <Label
                              {...{
                                value: DataTransform(currentDiscount.startDate),
                                lighter: true,
                              }}
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="End-Date" />
                        </td>
                        <td>
                          {currentDiscount.endDate && (
                            <DateLabel
                              endDate={DataTransform(currentDiscount.endDate)}
                              formatedDate={true}
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Requires-Coupon-Code" />
                        </td>
                        <td>
                          {' '}
                          <Label
                            {...labelYesNoStyle[
                              currentDiscount?.requiresCouponCode
                            ]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Coupon-Code" />
                        </td>
                        <td>{currentDiscount.couponCode}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Is-Cumulative" />
                        </td>
                        <td>
                          {' '}
                          <Label
                            {...labelYesNoStyle[currentDiscount?.isCumulative]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Discount-Limitation" />
                        </td>
                        <td>
                          {
                            discountLimitationOptions.find(
                              (option) =>
                                option.value ===
                                currentDiscount.discountLimitation
                            )?.label
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Limitation-Times" />
                        </td>
                        <td>{currentDiscount.limitationTimes}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Is-Active" />
                        </td>
                        <td>
                          <Label
                            {...labelYesNoStyle[currentDiscount?.isActive]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Created-Date" />
                        </td>
                        <td>
                          {DataTransform(currentDiscount.createdDate).replace(
                            'T',
                            ' '
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          <SafeFormatMessage id="Last-Updated-Date" />
                        </td>
                        <td>
                          {DataTransform(currentDiscount.editedDate).replace(
                            'T',
                            ' '
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </TabPanel>

            <TabPanel header={<SafeFormatMessage id="Usage-Histories" />}>
              <DiscountUsageHistory />
            </TabPanel>
            {entityType && (
              <TabPanel
                header={getKeyByValueWithFormattedMessage(
                  entityTypes,
                  entityType
                )}
              >
                <DiscountLinkedEntities />
              </TabPanel>
            )}
          </TabView>
        </div>
      )}
    </Wrapper>
  )
}

export default DiscountDetails
