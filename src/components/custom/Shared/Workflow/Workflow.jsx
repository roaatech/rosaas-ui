import React, { useEffect, useState } from "react";
import { Wrapper } from "./Workflow.styled";
import TenantStatus from "../../tenant/TenantStatus/TenantStatus";
import useGlobal from "../../../../lib/hocks/global";
import { Owner } from "../../../../const";
import { useParams } from "react-router-dom";
import useRequest from "../../../../axios/apis/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../../../../store/slices/tenants";

const Workflow = ({ productId, updateDetails, productIndex }) => {
  // const [timeLine, setTimeLine] = useState([]);
  const { getTimeLine } = useRequest();
  const dispatch = useDispatch();
  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  const tenantsData = useSelector((state) => state.tenants.tenants);

  const timeLine = tenantsData[routeParams.id].products[productIndex].history;

  useEffect(() => {
    (async () => {
      if (!tenantsData[routeParams.id].products[productIndex].history) {
        const timeLineReq = await getTimeLine(routeParams.id, productId);
        dispatch(
          history({
            tenantId: routeParams.id,
            productIndex,
            data: timeLineReq.data.data,
          })
        );
      }
    })();
  }, [routeParams.id, updateDetails]);

  return (
    <Wrapper>
      <div className="timeLineCont">
        {timeLine?.map((item, index) => (
          <div className="time-line-item-container" key={index}>
            <div className="timeLineItemCont" key={index}>
              <div className="author">{Owner[item.ownerType]}</div>
              <div className="info">
                <div className="action">
                  <TenantStatus statusValue={item.status} />
                </div>
                {/* <div className="action">{statusArray[item.status]}</div> */}
                <div className="time">{DataTransform(item.created)}</div>
              </div>
              <div className="message">{item.message}</div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default Workflow;
