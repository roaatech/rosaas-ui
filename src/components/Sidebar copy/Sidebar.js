/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { BsFillPersonLinesFill } from "react-icons/bs";
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

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Wrapper>
        <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
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
          <div className="sidebar-inner px-4 pt-3">
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
              {/* <NavItem
                title="Dashboard"
                link={Routes.DashboardOverview.path}
                // icon={faChartPie}
              /> */}
              <NavItem
                title="Tenant"
                link={Routes.Tenant.path}
                icon={BsFillPersonLinesFill}
              />
              {/* <NavItem
                external
                title="Messages"
                link="https://demo.themesberg.com/volt-pro-react/#/messages"
                target="_blank"
                badgeText="Pro"
                icon={faInbox}
              />
              <NavItem
                title="Transactions"
                icon={faHandHoldingUsd}
                link={Routes.Transactions.path}
              />
              <NavItem
                title="Settings"
                icon={faCog}
                link={Routes.Settings.path}
              />
              <NavItem
                external
                title="Calendar"
                link="https://demo.themesberg.com/volt-pro-react/#/calendar"
                target="_blank"
                badgeText="Pro"
                icon={faCalendarAlt}
              />
              <NavItem
                external
                title="Map"
                link="https://demo.themesberg.com/volt-pro-react/#/map"
                target="_blank"
                badgeText="Pro"
                icon={faMapPin}
              />
            */}

              <CollapsableNavItem
                eventKey="tables/"
                title="Tables"
                icon={BsFillPersonLinesFill}>
                <NavItem
                  title="Bootstrap Table"
                  link={Routes.BootstrapTables.path}
                />
              </CollapsableNavItem>

              <CollapsableNavItem
                eventKey="examples/"
                title="Page Examples"
                icon={BsFillPersonLinesFill}>
                <NavItem title="Sign In" link={Routes.Signin.path} />
                <NavItem title="Sign Up" link={Routes.Signup.path} />
                <NavItem
                  title="Forgot password"
                  link={Routes.ForgotPassword.path}
                />
                <NavItem
                  title="Reset password"
                  link={Routes.ResetPassword.path}
                />
                <NavItem title="Lock" link={Routes.Lock.path} />
                <NavItem title="404 Not Found" link={Routes.NotFound.path} />
                <NavItem
                  title="500 Server Error"
                  link={Routes.ServerError.path}
                />
              </CollapsableNavItem>
              {/*
              <NavItem
                external
                title="Plugins"
                link="https://demo.themesberg.com/volt-pro-react/#/plugins/datatable"
                target="_blank"
                badgeText="Pro"
                icon={faChartPie}
              />

              <Dropdown.Divider className="my-3 border-indigo" />

              <CollapsableNavItem
                eventKey="components/"
                title="Components"
                icon={faBoxOpen}>
                <NavItem title="Accordion" link={Routes.Accordions.path} />
                <NavItem title="Alerts" link={Routes.Alerts.path} />
                <NavItem title="Badges" link={Routes.Badges.path} />
                <NavItem
                  external
                  title="Widgets"
                  link="https://demo.themesberg.com/volt-pro-react/#/components/widgets"
                  target="_blank"
                  badgeText="Pro"
                />
                <NavItem title="Breadcrumbs" link={Routes.Breadcrumbs.path} />
                <NavItem title="Buttons" link={Routes.Buttons.path} />
                <NavItem title="Forms" link={Routes.Forms.path} />
                <NavItem title="Modals" link={Routes.Modals.path} />
                <NavItem title="Navbars" link={Routes.Navbars.path} />
                <NavItem title="Navs" link={Routes.Navs.path} />
                <NavItem title="Pagination" link={Routes.Pagination.path} />
                <NavItem title="Popovers" link={Routes.Popovers.path} />
                <NavItem title="Progress" link={Routes.Progress.path} />
                <NavItem title="Tables" link={Routes.Tables.path} />
                <NavItem title="Tabs" link={Routes.Tabs.path} />
                <NavItem title="Toasts" link={Routes.Toasts.path} />
                <NavItem title="Tooltips" link={Routes.Tooltips.path} />
              </CollapsableNavItem>
              <NavItem
                external
                title="Themesberg"
                link="https://themesberg.com"
                target="_blank"
                image={ThemesbergLogo}
              />
              <Button
                as={Link}
                to={Routes.Upgrade.path}
                variant="secondary"
                className="upgrade-to-pro">
                <FontAwesomeIcon icon={faRocket} className="me-1" /> Upgrade to
                Pro
              </Button> */}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
