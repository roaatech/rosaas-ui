import React, { useState } from "react"; 
import ProductUrl from "../UrlItem/UrlItem";

const UrlItemList = (data) => { 
  const [UrlItemList, setURLS] = useState([
    {
      method: "POST",
      path: data.data.creationEndpoint,
      title: "Creation Endpoint",
    },
    {
      method: "PUT",
      path: data.data.activationEndpoint,
      title: "Activation Endpoint",
    },
    {
      method: "PUT",
      path: data.data.deactivationEndpoint,
      title: "Deactivation Endpoint",
    },
    {
      method: "DELETE",
      path: data.data.deletionEndpoint,
      title: "Deletion Endpoint",
    },
  ]);

  return (  
    UrlItemList.map((url) => ( 
        <tr>
        <td className="fw-bold">{url.title}</td>
        <td className="url-container">  
         <ProductUrl data={url} />
        </td>
        </tr>
      )) 
  );
};

export default UrlItemList;
