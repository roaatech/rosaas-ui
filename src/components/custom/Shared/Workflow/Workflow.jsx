import React, { useEffect, useState } from "react";
import { Wrapper } from "./Workflow.styled";
import TenantStatus from "../../tenant/TenantStatus/TenantStatus";
import useGlobal from "../../../../lib/hocks/global";
import { Owner } from "../../../../const";
import { useParams } from "react-router-dom";
import useRequest from "../../../../axios/apis/useRequest";

const Workflow = ({ updateDetails }) => {
  const [timeLine, setTimeLine] = useState([]);
  const { getTimeLine } = useRequest();

  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  useEffect(() => {
    (async () => {
      const timeLineReq = await getTimeLine(routeParams.id);
      setTimeLine(timeLineReq.data.data);
    })();
  }, [updateDetails, routeParams.id]);

  return (
    <Wrapper>
      <div className="timeLineCont">
        {timeLine.map((item, index) => (
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
        ))}
      </div>
    </Wrapper>
  );
};

export default Workflow;
