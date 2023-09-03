import React, { useEffect, useState } from 'react'
import { Wrapper } from './Workflow.styled'
import TenantStatus from '../../tenant/TenantStatus/TenantStatus'
import { Owner, processType } from '../../../../const'
import { useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import { history } from '../../../../store/slices/tenants'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import MetaDataAccordion from '../../tenant/MetaDataAccordion/MetaDataAccordion'
import { Card } from '@themesberg/react-bootstrap'
import ReactJson from 'react-json-view'
import { FormattedMessage } from 'react-intl'
import CustomPaginator from '../CustomPaginator/CustomPaginator'
import { HealthStatus } from '../../../../const'
import Label from '../label/Label'
const Workflow = ({ productId, updateDetails, productIndex, refresh }) => {
  const { getTimeLine } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)

  const timeLine = tenantsData[routeParams.id].products[productIndex].history

  const allItems = () => {
    let items = []
    for (let i = first; i < first + rows; i++) {
      if (timeLine?.items[i]) items = [...items, timeLine.items[i]]
    }
    return items
  }

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <Card border="light" className="border-0">
          <Card.Body className="p-0">
            <ReactJson src={data} name={false} />
          </Card.Body>
        </Card>
      </div>
    )
  }
  useEffect(() => {
    let query = `?page=${Math.ceil((first + 1) / rows)}&pageSize=${rows}`
    ;(async () => {
      if (
        !tenantsData[routeParams.id].products[productIndex].history?.items[
          first
        ]
      ) {
        const timeLineReq = await getTimeLine(routeParams.id, productId, query)
        dispatch(
          history({
            tenantId: routeParams.id,
            productIndex,
            data: timeLineReq.data.data,
            from: first,
          })
        )
      }
    })()
  }, [routeParams.id, updateDetails, first, rows])

  return (
    <Wrapper>
      <div className="timeLineCont">
        {allItems().map((item, index) => (
          <div className="">
            <div className="time-line-item-container" key={index}>
              <MetaDataAccordion
                defaultKey="metaData"
                data={[
                  {
                    eventKey: 'metadata',
                    title: (
                      <div className="timeLineItemCont" key={index}>
                        <div className="flex justify-content-between flex-wrap">
                          <div className="mb-2">
                            {processType[item.processType] == 'Healthy' ? (
                              <div className="HealthStatus">
                                <Label {...HealthStatus['true']} />
                                {item.updatesCount > 1
                                  ? ' (' + item.updatesCount + ')'
                                  : ''}
                              </div>
                            ) : processType[item.processType] == 'Unhealthy' ? (
                              <div className="HealthStatus">
                                <Label {...HealthStatus['false']} />
                                {item.updatesCount > 1
                                  ? ' (' + item.updatesCount + ')'
                                  : ''}
                              </div>
                            ) : (
                              <div className="processType">
                                <FormattedMessage
                                  id={processType[item.processType]}
                                />
                              </div>
                            )}
                          </div>
                          <div className="author mb-2">
                            <FormattedMessage id={Owner[item?.ownerType]} />
                          </div>
                        </div>
                        <div className="flex justify-content-between flex-wrap">
                          <div className="action mb-2">
                            <TenantStatus statusValue={item.status} />
                          </div>
                          <div className="time mb-2">
                            {DataTransform(item.processDate)}
                          </div>
                        </div>
                      </div>
                    ),
                    description: item?.data
                      ? rowExpansionTemplate(JSON.parse(item?.data))
                      : null,
                  },
                ]}
              />
            </div>
          </div>
        ))}
        <CustomPaginator
          first={first}
          rows={rows}
          totalCount={timeLine?.totalCount}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 20, 9]}
        />
      </div>
    </Wrapper>
  )
}

export default Workflow
