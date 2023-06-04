import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb } from "@themesberg/react-bootstrap";
import { Wrapper } from "./Breadcrumb.styled";

const BreadcrumbComponent = ({ description, title, child, icon, parent }) => {
  return (
    <>
      {title && (
        <Wrapper className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2">
          <div className="d-block mb-xl-0">
            <Breadcrumb
              className="d-none d-md-inline-block"
              listProps={{
                className: "breadcrumb-dark breadcrumb-transparent",
              }}>
              {icon && (
                <Breadcrumb.Item>
                  <FontAwesomeIcon icon={icon} />
                </Breadcrumb.Item>
              )}
              <Breadcrumb.Item>{parent}</Breadcrumb.Item>
              {child && <Breadcrumb.Item active>{child}</Breadcrumb.Item>}
            </Breadcrumb>
            {<h4>{title}</h4>}
            {description && <p className="mb-0">{description}</p>}
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default BreadcrumbComponent;
