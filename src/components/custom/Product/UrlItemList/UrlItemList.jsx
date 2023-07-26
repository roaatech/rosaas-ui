import React, { useEffect, useState } from "react";
import ProductUrl from "../UrlItem/UrlItem";

const UrlItemList = ({ data }) => {
  const [UrlItemList, setURLS] = useState([]);

  useEffect(() => {
    setURLS([
      {
        method: "GET",
        path: data.defaultHealthCheckUrl,
        title: "Default Health Check Url",
      },
      {
        method: "POST",
        path: data.healthStatusChangeUrl,
        title: "Health Status Change Url",
      },
      {
        method: "POST",
        path: data.creationEndpoint,
        title: "Creation Url",
      },
      {
        method: "PUT",
        path: data.activationEndpoint,
        title: "Activation Url",
      },
      {
        method: "PUT",
        path: data.deactivationEndpoint,
        title: "Deactivation Url",
      },
      {
        method: "DELETE",
        path: data.deletionEndpoint,
        title: "Deletion Url",
      },
    ]);
  }, [data]);

  return UrlItemList.map((url) => (
    <tr>
      <td className="fw-bold">{url.title}</td>
      <td className="url-container">
        <ProductUrl data={url} />
      </td>
    </tr>
  ));
};

export default UrlItemList;
