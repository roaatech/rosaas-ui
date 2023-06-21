import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb } from "@themesberg/react-bootstrap";
import { Wrapper } from "./Breadcrumb.styled";
import { useEffect } from "react";
const BreadcrumbComponent = ({
  description,
  title,
  child,
  icon: Icon,
  parent,
}) => {
  useEffect(() => {
    if (child) {
      document.title = `ROSAS-${child}`;
    } else if (parent) {
      document.title = `ROSAS-${parent}`;
    }
  });

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
              {Icon && (
                <Breadcrumb.Item>
                  <Icon />
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
