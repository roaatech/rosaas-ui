import React, { useState } from "react";
import { urlStyle } from "../../../../const";
import { Wrapper } from "./UrlItem.styled"; 

const UrlItem = (data) => {   
  const url = data.data;
  return (   
     <Wrapper>
        <div
          className="bar"
          style={{
            background: urlStyle[url.method].lightColor,
            borderColor: urlStyle[url.method].darkColor,
          }}>
          <div className="info">
            <span
              className="method"
              style={{ background: urlStyle[url.method].darkColor }}>
              {url.method}
            </span>
            <span className="url">{url.path}</span>
          </div>
          <span className="title"> </span>
     </div> 
        </Wrapper>

  );
};

export default UrlItem;
