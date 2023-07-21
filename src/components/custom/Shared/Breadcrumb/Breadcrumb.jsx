import React from "react";

import { BsFillHouseDoorFill } from "react-icons/bs";
import { Breadcrumb } from "@themesberg/react-bootstrap";
import { Wrapper } from "./Breadcrumb.styled";
import { useEffect } from "react";
import Navbar from "../../../Navbar";
import { breadcrumbConst } from "../../../../const";

const BreadcrumbComponent = ({ breadcrumbInfo, param1, parent }) => {
  const hasInfo = breadcrumbInfo ? "yes" : null;
  let navigation = "#";
  if (breadcrumbInfo) {
    if (breadcrumbConst[breadcrumbInfo].navigation) {
      navigation = breadcrumbConst[breadcrumbInfo].navigation;
      if (param1) {
        navigation = breadcrumbConst[breadcrumbInfo].navigation.replace(
          "{0}",
          param1
        );
      }
    }
  }
  useEffect(() => {
    if (breadcrumbInfo) {
      if (breadcrumbConst[breadcrumbInfo].name) {
        document.title = `ROSAS - ${breadcrumbConst[breadcrumbInfo].name}`;
      } else if (parent) {
        document.title = `ROSAS - ${breadcrumbConst[breadcrumbInfo].name}`;
      }
    }
  });
  return (
    <>
      <Wrapper className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2">
        <div className="d-block mb-xl-0">
          {hasInfo && (
            <Breadcrumb
              className="d-none d-md-inline-block"
              listProps={{
                className: "breadcrumb-dark breadcrumb-transparent",
              }}>
              <Breadcrumb.Item href="/">
                <BsFillHouseDoorFill />
              </Breadcrumb.Item>

              {breadcrumbConst[breadcrumbInfo].title && (
                <Breadcrumb.Item
                  href={navigation}
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    breadcrumbConst[breadcrumbInfo].title
                  }>
                  {breadcrumbConst[breadcrumbInfo].title}
                </Breadcrumb.Item>
              )}

              {breadcrumbConst[breadcrumbInfo].parent && (
                <Breadcrumb.Item
                  href={navigation}
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    breadcrumbConst[breadcrumbInfo].parent
                  }>
                  {breadcrumbConst[breadcrumbInfo].parent}
                </Breadcrumb.Item>
              )}

              {breadcrumbConst[breadcrumbInfo].name && (
                <Breadcrumb.Item
                  href={navigation}
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    breadcrumbConst[breadcrumbInfo].name
                  }>
                  {breadcrumbConst[breadcrumbInfo].name}
                </Breadcrumb.Item>
              )}

              {breadcrumbConst[breadcrumbInfo].child && (
                <Breadcrumb.Item
                  href={navigation}
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    breadcrumbConst[breadcrumbInfo].child
                  }>
                  {breadcrumbConst[breadcrumbInfo].child}
                </Breadcrumb.Item>
              )}
            </Breadcrumb>
          )}
        </div>
        <Navbar />
      </Wrapper>
    </>
  );
};

export default BreadcrumbComponent;
