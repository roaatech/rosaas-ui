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

const Workflow = ({ productId, updateDetails, productIndex, refresh }) => {
  const { getTimeLine } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(5)

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
          <div className="time-line-item-container" key={index}>
            <div className="timeLineItemCont" key={index}>
              <div className="processType mb-1">
                <FormattedMessage id={processType[item.processType]} />
              </div>
              <div className="info">
                <div className="action">
                  <TenantStatus statusValue={item.status} />
                </div>
                <div className="time">{DataTransform(item.processDate)}</div>
              </div>
              <div className="my-1">
                <MetaDataAccordion
                  defaultKey="metaData"
                  data={[
                    {
                      eventKey: 'metadata',
                      title: <FormattedMessage id="Data" />,
                      description: item?.data
                        ? rowExpansionTemplate(JSON.parse(item?.data))
                        : null,
                    },
                  ]}
                />
              </div>

              <div className="author">
                <FormattedMessage id={Owner[item?.ownerType]} />
              </div>
            </div>
          </div>
        ))}

        <CustomPaginator
          first={first}
          rows={rows}
          totalCount={timeLine?.totalCount}
          onPageChange={onPageChange}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </div>
    </Wrapper>
  )
}

export default Workflow
