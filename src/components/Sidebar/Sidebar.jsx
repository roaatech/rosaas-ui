/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useNavigate } from 'react-router-dom'

import {
  BsFillPersonLinesFill,
  BsBoxSeam,
  BsFillPersonFill,
  BsGearFill,
  BsFillClipboard2CheckFill,
  BsBoxes,
  BsSubscript,
  BsPersonFillDown,
  BsPersonSlash,
  BsPeople,
  BsExclamationTriangle,
  BsBank,
  BsPersonFillGear,
} from 'react-icons/bs'
import {
  Nav,
  Badge,
  Image,
  Button,
  Accordion,
  Navbar,
} from '@themesberg/react-bootstrap'
import { Link } from 'react-router-dom'
import { Routes } from '../../routes'
import logoEn from '../../assets/img/brand/rosas.svg'
import logoAr from '../../assets/img/brand/rosas-ar.svg'
import ProfilePicture from '../../assets/img/team/profile-picture-1.png'
import { logOut } from '../../store/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { SidebarWrapper, Wrapper } from './Sidebar.styled'

import useRequest from '../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import { setAllTenant } from '../../store/slices/tenants'
import { setAllProduct } from '../../store/slices/products/productsSlice.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimes,
  faSignOutAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import QuickActions from './QuickActions/QuickActions'
import { setAllProductOwners } from '../../store/slices/productsOwners.js'
import { MdInfo } from 'react-icons/md'

export default (props = {}) => {
  const navigate = useNavigate()

  const location = useLocation()
  const { pathname } = location
  const [show, setShow] = useState(false)
  const showClass = show ? 'show' : ''
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.userInfo)
  const productsOwnersData = useSelector(
    (state) => state.productsOwners.productsOwners
  )

  const tenantsData = useSelector((state) => state.tenants.tenants)
  const productsData = useSelector((state) => state.products.products)
  const [searchValue, setSearchValue] = useState('')
  const [filteredTenant, setFilteredTenant] = useState(
    Object.values(tenantsData)
  )
  const [filteredProducts, setFilteredProducts] = useState(
    Object.values(productsData)
  )
  const [filteredProductsOwner, setFilteredProductsOwner] = useState()

  let userRole = useSelector((state) => state.auth.userInfo.userType)
  const roles = ['', 'superAdmin', 'clientAdmin', 'ProductAdmin', 'tenantAdmin']

  let unFilteredProducts = Object.values(productsData)
  let unFilteredProductsOwners = Object.values(productsOwnersData)
  const setUnFilteredProducts = (newData) => {
    unFilteredProducts = newData
  }

  let direction = useSelector((state) => state.main.direction)
  let selectedLogo

  if (direction === 'rtl') {
    selectedLogo = logoAr
  } else {
    selectedLogo = logoEn
  }
  const [visibleHead, setVisibleHead] = useState(false)
  const [first, setFirst] = useState(0)
  const { getTenantList, getProductList, getProductOwnersList } = useRequest()
  const [update, setUpdate] = useState(1)

  const onCollapse = () => setShow(!show)

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : ''
    const [productsAccordionOpen, setProductsAccordionOpen] = useState(true)

    const toggleProductsAccordion = () => {
      setProductsAccordionOpen(!productsAccordionOpen)
    }

    return (
      <Wrapper direction={direction}>
        <Accordion as={Nav.Item} defaultActiveKey={'open'}>
          <Accordion.Item eventKey={eventKey}>
            <Accordion.Button
              as={Nav.Link}
              className="d-flex justify-content-between align-items-center"
              onClick={toggleProductsAccordion}
            >
              <span>
                <span className="sidebar-icon">{icon}</span>
                <span className="sidebar-text">{title}</span>
              </span>
            </Accordion.Button>
            <Accordion.Body className="multi-level">
              <Nav className="flex-column">{children}</Nav>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Wrapper>
    )
  }

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon: Icon,
      image,
      badgeText,
      badgeBg = 'secondary',
      badgeColor = 'primary',
      isActive = false,
    } = props
    const classNames = badgeText
      ? 'd-flex justify-content-start align-items-center justify-content-between'
      : ''
    const navItemClassName = pathname.includes(link) || isActive ? 'active' : ''
    const linkProps = external ? { href: link } : { as: Link, to: link }

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
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    )
  }

  const sidebarStatus = (group) => {
    return group.some((obj) => location.pathname.includes(obj.id))
  }
  const [activeIndex, setActiveIndex] = useState(0)

  const paramsID = useParams().id

  let allTenant = Object.values(filteredTenant)

  const active = allTenant.filter(
    (item) => item.status == 4 || item.status == 7
  )
  const inactive = allTenant.filter(
    (item) => !(item.status == 4 || item.status == 7 || item.status == 13)
  )
  const archived = allTenant.filter((item) => item.status == 13)
  const isSearchPerformed = searchValue !== ''

  const inactiveIsOpen = isSearchPerformed
    ? 'open'
    : sidebarStatus(inactive)
    ? 'open'
    : 'close'
  const activeIsOpen = isSearchPerformed
    ? 'open'
    : sidebarStatus(active)
    ? 'open'
    : 'close'
  const archivedIsOpen = sidebarStatus(archived) ? 'open' : 'close'
  const settingIsOpen = sidebarStatus([{ id: 'setting' }]) ? 'open' : 'close'
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    let query = `?pageSize=${100}&filters[0].Field=SearchTerm`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    ;(async () => {
      const listData = await getTenantList(query)
      setFilteredTenant(listData.data.data.items)
      dispatch(setAllTenant(listData.data.data.items))
    })()
  }, [first, searchValue, update, paramsID])
  useEffect(() => {
    let query = `?pageSize=${100}&filters[0].Field=name&filters[0].Operator=contains`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    ;(async () => {
      const listData = await getProductList(query)
      dispatch(setAllProduct(listData.data.data.items))
      setFilteredProducts(listData.data.data.items)
    })()
  }, [searchValue, allProducts])
  useEffect(() => {
    if (userRole != 'superAdmin') {
      return
    }
    let query = `?pageSize=${100}&filters[0].Field=name&filters[0].Operator=contains`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    ;(async () => {
      const listData = await getProductOwnersList(query)
      dispatch(setAllProductOwners(listData.data.data.items))
      setFilteredProductsOwner(listData.data.data.items)
    })()
  }, [searchValue])

  const setSearchValues = (searchValue) => {
    setSearchValue(searchValue)
  }

  const productsIsOpen =
    !pathname.includes('productsOwners') && pathname.includes('products/')
      ? 'open'
      : 'close'
  const productsOwnersIsOpen = pathname.includes('productsOwners')
    ? 'open'
    : 'close'

  return (
    <SidebarWrapper>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
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
                  <h6>
                    <FormattedMessage id="Hi" />, {userInfo.email}
                  </h6>
                  <Button
                    as={Link}
                    variant="secondary"
                    size="xs"
                    onClick={() => dispatch(logOut())}
                    className="text-dark"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mx-2" />
                    <FormattedMessage id="Sign-Out" />
                  </Button>
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>

            <Nav className="flex-column pt-3 pt-md-0">
              <img src={selectedLogo} alt="logo" className="my-3 logo" />

              <QuickActions setSearchValue={setSearchValues} />
              {userRole == 'clientAdmin' && (
                <NavItem
                  key={'details'}
                  title={'Info'}
                  link={`${Routes.productsOwners.path}/info`}
                  icon={MdInfo}
                  isActive={location.pathname.includes(
                    `${Routes.productsOwners.path}/info`
                  )}
                />
              )}
              {active.length ? (
                <CollapsableNavItem
                  eventKey={activeIsOpen}
                  title={<FormattedMessage id="Active-Tenant" />}
                  icon={BsFillPersonLinesFill}
                >
                  {active.map((item, index) => (
                    <NavItem
                      key={index}
                      title={item.systemName}
                      link={`${Routes.Tenant.path}/${item.id}`}
                      icon={BsFillPersonFill}
                    />
                  ))}
                </CollapsableNavItem>
              ) : null}
              {inactive.length ? (
                <CollapsableNavItem
                  eventKey={inactiveIsOpen}
                  title={<FormattedMessage id="Tenants" />}
                  icon={<BsFillPersonLinesFill />}
                >
                  {inactive.map((item, index) => (
                    <NavItem
                      key={index}
                      title={item.systemName}
                      link={`${Routes.Tenant.path}/${item.id}`}
                      icon={BsFillPersonFill}
                    />
                  ))}
                </CollapsableNavItem>
              ) : null}

              {archived.length ? (
                <CollapsableNavItem
                  eventKey={archivedIsOpen}
                  title="Archived Tenants"
                  icon={<BsFillPersonLinesFill />}
                >
                  {archived.map((item, index) => (
                    <NavItem
                      key={index}
                      title={item.systemName}
                      link={`/tenants/${item.id}`}
                    />
                  ))}
                </CollapsableNavItem>
              ) : null}

              {(userRole == 'productOwner' ||
                userRole == 'superAdmin' ||
                userRole == 'clientAdmin') &&
              Array.isArray(
                searchValue.length ? filteredProducts : unFilteredProducts
              ) &&
              (searchValue.length ? filteredProducts : unFilteredProducts)
                .length > 0 ? (
                <CollapsableNavItem
                  eventKey={productsIsOpen}
                  title={
                    <span onClick={() => navigate(Routes.products.path)}>
                      <FormattedMessage id="Products" />
                    </span>
                  }
                  icon={
                    <span onClick={() => navigate(Routes.products.path)}>
                      <BsBoxes />
                    </span>
                  }
                  style={{}}
                >
                  {(searchValue.length
                    ? filteredProducts
                    : unFilteredProducts
                  ).map((product, index) => (
                    <NavItem
                      key={index}
                      title={product.systemName}
                      link={`${Routes.products.path}/${product.id}`}
                      icon={BsBoxSeam}
                      isActive={location.pathname.includes(
                        `${Routes.products.path}/${product.id}`
                      )}
                    />
                  ))}
                </CollapsableNavItem>
              ) : null}

              {userRole == 'superAdmin' &&
              Array.isArray(
                searchValue.length ? filteredProducts : unFilteredProducts
              ) &&
              (searchValue.length ? filteredProducts : unFilteredProducts)
                .length > 0 ? (
                <CollapsableNavItem
                  eventKey={productsOwnersIsOpen}
                  title={
                    <span onClick={() => navigate(Routes.productsOwners.path)}>
                      <FormattedMessage id="Products-Owners" />
                    </span>
                  }
                  icon={
                    <span onClick={() => navigate(Routes.productsOwners.path)}>
                      <BsBoxes />
                    </span>
                  }
                  style={{}}
                >
                  {(searchValue.length
                    ? filteredProductsOwner
                    : unFilteredProductsOwners
                  ).map((productsOwner, index) => (
                    <NavItem
                      key={index}
                      title={productsOwner?.systemName}
                      link={`${Routes.productsOwners.path}/${productsOwner?.id}`}
                      icon={BsBoxSeam}
                      isActive={location.pathname.includes(
                        `${Routes.productsOwners.path}/${productsOwner?.id}`
                      )}
                    />
                  ))}
                </CollapsableNavItem>
              ) : null}

              {userRole == 'superAdmin' && (
                <CollapsableNavItem
                  eventKey={settingIsOpen}
                  title={<FormattedMessage id="Settings" />}
                  icon={<BsGearFill />}
                >
                  <NavItem
                    title={<FormattedMessage id="Health-Check-sidebar" />}
                    link={Routes.Settings.path}
                    icon={BsFillClipboard2CheckFill}
                  />

                  <NavItem
                    title={<FormattedMessage id="Subscriptions" />}
                    link={Routes.SubscriptionsSettings.path}
                    icon={BsPeople}
                  />

                  <NavItem
                    title={<FormattedMessage id="Product-Warnings" />}
                    link={Routes.ProductWarningsSettings.path}
                    icon={BsExclamationTriangle}
                  />

                  <NavItem
                    title={<FormattedMessage id="Card-Management" />}
                    link={Routes.CardSettings.path}
                    icon={BsBank}
                  />

                  <NavItem
                    title={<FormattedMessage id="Profile" />}
                    link={Routes.Profile.path}
                    icon={BsPersonFillGear}
                  />
                </CollapsableNavItem>
              )}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </SidebarWrapper>
  )
}
