/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { BsFillPersonLinesFill, BsBoxSeam } from "react-icons/bs";
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import ThemesbergLogo from "../../assets/img/themesberg.svg";
import logo from "../../assets/img/brand/roaa-tech.png";
import ProfilePicture from "../../assets/img/team/profile-picture-1.png";
import { logOut } from "../../store/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Wrapper } from "./Sidebar.styled";
import TableHead from "../custom/Shared/TableHead/TableHead";
import TenantForm from "../custom/tenant/TenantForm/TenantForm";
import useRequest from "../../axios/apis/useRequest";

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const updateSlider = useSelector((state) => state.main.sidebar);
  const [searchValue, setSearchValue] = useState("");
  const [visibleHead, setVisibleHead] = useState(false);
  const [first, setFirst] = useState(0);
  const [update, setUpdate] = useState(1);
  const { getTenantList } = useRequest();
  const [list, setList] = useState([]);
  const [inactive, setInactive] = useState([]);
  const [active, setActive] = useState([]);

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";
    // const x = ["ActiveTenant ", "InactiveTenant"];
    return (
      <Wrapper>
        <Accordion as={Nav.Item} defaultActiveKey={"open"}>
          <Accordion.Item eventKey={eventKey}>
            <Accordion.Button
              as={Nav.Link}
              className="d-flex justify-content-between align-items-center">
              <span>
                <span className="sidebar-icon">
                  {/* <FontAwesomeIcon icon={icon} /> */}
                </span>
                <span className="sidebar-text">{title}</span>
              </span>
            </Accordion.Button>
            <Accordion.Body className="multi-level">
              <Nav className="flex-column">{children}</Nav>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Wrapper>
    );
  };

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon: Icon,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
    } = props;
    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {Icon ? (
              <span className="sidebar-icon">
                <Icon />
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2">
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  useEffect(() => {
    let query = `?pageSize=${100}&filters[0].Field=SearchTerm`;
    if (searchValue) query += `&filters[0].Value=${searchValue}`;

    (async () => {
      const listData = await getTenantList(query);
      setList(listData.data.data.items);
      setActive(listData.data.data.items.filter((item) => item.status == 1));
      setInactive(listData.data.data.items.filter((item) => item.status == 2));
    })();
  }, [first, searchValue, update, updateSlider]);

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={Routes.DashboardOverview.path}>
          <Image src={logo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3 pb-6">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image
                    src={ProfilePicture}
                    className="card-img-top rounded-circle border-white"
                  />
                </div>
                <div className="d-block">
                  <h6>Hi, {userInfo.email}</h6>
                  <Button
                    as={Link}
                    variant="secondary"
                    size="xs"
                    // to={Routes.Signin.path}
                    onClick={() => dispatch(logOut())}
                    className="text-dark">
                    {/* <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{" "} */}
                    Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}>
                {/* <FontAwesomeIcon icon={faTimes} /> */}
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <img
                src={logo}
                alt="logo"
                className="my-3"
                style={{ maxWidth: "200px" }}
              />

              <TableHead
                label={"Add Tenant"}
                icon={"pi-user-plus"}
                setSearchValue={setSearchValue}
                visibleHead={visibleHead}
                setVisibleHead={setVisibleHead}
                setFirst={setFirst}>
                <TenantForm
                  type={"create"}
                  update={update}
                  setUpdate={setUpdate}
                  visibleHead={visibleHead}
                  setVisibleHead={setVisibleHead}
                />
              </TableHead>
              {active.length ? (
                <CollapsableNavItem
                  eventKey="open"
                  title="Active Tenant"
                  icon={BsFillPersonLinesFill}>
                  {active
                    .filter((item) => item.status == 1)
                    .map((item) => (
                      <>
                        <NavItem
                          title={item.uniqueName}
                          link={`/tenantDetails/${item.id}`}
                        />
                      </>
                    ))}
                  {console.log({ active })}
                </CollapsableNavItem>
              ) : null}
              {inactive.length ? (
                <CollapsableNavItem
                  eventKey="open"
                  title="Inactive Tenant"
                  icon={BsFillPersonLinesFill}>
                  {inactive.map((item) => (
                    <>
                      <NavItem
                        title={item.uniqueName}
                        link={`/tenantDetails/${item.id}`}
                      />
                    </>
                  ))}
                </CollapsableNavItem>
              ) : null}
              <NavItem title="Product" link={`/product`} icon={BsBoxSeam} />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
