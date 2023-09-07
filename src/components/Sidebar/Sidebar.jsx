/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import {
  BsFillPersonLinesFill,
  BsBoxSeam,
  BsFillPersonFill,
  BsGearFill,
  BsFillClipboard2CheckFill,
  BsStars,
  BsPencilSquare,
  BsPencil,
  BsBoxes,
} from 'react-icons/bs'
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar,
} from '@themesberg/react-bootstrap'
import { Link } from 'react-router-dom'
import { Routes } from '../../routes'
import logo from '../../assets/img/brand/rosas.svg'
import ProfilePicture from '../../assets/img/team/profile-picture-1.png'
import { logOut } from '../../store/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { SidebarWrapper, Wrapper } from './Sidebar.styled'
import TableHead from '../custom/Shared/TableHead/TableHead'
import TenantForm from '../custom/tenant/TenantForm/TenantForm'
import useRequest from '../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import { setAllTenant } from '../../store/slices/tenants'
import { setAllProduct } from '../../store/slices/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import QuickActions from './QuickActions/QuickActions'

export default (props = {}) => {
  const location = useLocation()
  const { pathname } = location
  const [show, setShow] = useState(false)
  const showClass = show ? 'show' : ''
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.userInfo)
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const productsData = useSelector((state) => state.products.products)
  const [searchValue, setSearchValue] = useState('')

  const [visibleHead, setVisibleHead] = useState(false)
  const [first, setFirst] = useState(0)
  const { getTenantList, getProductList } = useRequest()
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
      <Wrapper>
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
    const navItemClassName = link === pathname || isActive ? 'active' : ''
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

  const paramsID = useParams().id

  let allTenant = Object.values(tenantsData)

  const active = allTenant.filter(
    (item) => item.status == 4 || item.status == 7
  )
  const inactive = allTenant.filter(
    (item) => !(item.status == 4 || item.status == 7 || item.status == 13)
  )
  const archived = allTenant.filter((item) => item.status == 13)
  const isSearchPerformed = searchValue !== ''

  const inactiveIsOpen = isSearchPerformed ? 'open' : 'close'
  const activeIsOpen = sidebarStatus(active) ? 'open' : 'close'
  const archivedIsOpen = sidebarStatus(archived) ? 'open' : 'close'
  const settingIsOpen = sidebarStatus([{ id: 'setting' }]) ? 'open' : 'close'
  const [searchResults, setSearchResults] = useState([])
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    const productsArray = Object.values(productsData)
    setAllProducts(productsArray)
  }, [productsData])
  useEffect(() => {
    let query = `?pageSize=${100}&filters[0].Field=SearchTerm`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    ;(async () => {
      // if (Object.keys(tenantsData).length == 0) {
      const listData = await getTenantList(query)
      dispatch(setAllTenant(listData.data.data.items))
      // }
    })()
  }, [first, searchValue, update, paramsID])

  useEffect(() => {
    let query = `?pageSize=${100}&filters[0].Field=name&filters[0].Operator=contains`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    ;(async () => {
      if (searchValue === '' && allProducts.length > 0) {
        setSearchResults(allProducts)
      } else {
        const listData = await getProductList(query)
        setSearchResults(listData.data.data.items)
      }
    })()
  }, [searchValue, allProducts])

  // useEffect(() => {
  //   let query = `?pageSize=${100}&filters[0].Field=name&filters[0].Operator=contains`
  //   if (searchValue)
  //     query += `&filters[0].Value=${searchValue}`

  //     // Always dispatch to the store to refresh product data
  //   ;(async () => {
  //     const listData = await getProductList(query)
  //     dispatch(setAllProduct(listData.data.data.items))
  //   })()
  // }, [searchValue, dispatch])

  const setSearchValues = (searchValue) => {
    setSearchValue(searchValue)
  }

  return (
    <SidebarWrapper>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={Routes.DashboardOverview.path}
        >
          <Image src={logo} className="navbar-brand-light" />
        </Navbar.Brand>
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
                    // to={Routes.Signin.path}
                    onClick={() => dispatch(logOut())}
                    className="text-dark"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
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
              <img src={logo} alt="logo" className="my-3 logo" />

              <QuickActions setSearchValue={setSearchValues} />
              {active.length ? (
                <CollapsableNavItem
                  eventKey={activeIsOpen}
                  title={<FormattedMessage id="Active-Tenant" />}
                  icon={BsFillPersonLinesFill}
                >
                  {active.map((item, index) => (
                    <NavItem
                      key={index}
                      title={item.uniqueName}
                      link={`/tenants/${item.id}`}
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
                      title={item.uniqueName}
                      link={`/tenants/${item.id}`}
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
                      title={item.uniqueName}
                      link={`/tenants/${item.id}`}
                    />
                  ))}
                </CollapsableNavItem>
              ) : null}

              {Array.isArray(searchResults) && searchResults.length > 0 ? (
                <CollapsableNavItem
                  eventKey={inactiveIsOpen}
                  title={
                    <Link
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        paddingRight: '70px',
                        marginTop: '-33px',
                        marginleft: '-80px',
                        marginBottom: '0px',
                        height: '35px',
                        backgroundColor: 'transparent',
                      }}
                      className=" products-nav nav-link  "
                      to="/products"
                    >
                      <BsBoxes
                        style={{
                          marginLeft: '-10px',
                        }}
                      />{' '}
                      {'  '}
                      <FormattedMessage id="Products" />
                    </Link>
                  }
                  icon={BsBoxSeam}
                  style={{}}
                >
                  {searchResults.map((product, index) => (
                    <NavItem
                      key={index}
                      title={product.name}
                      link={`/products/${product.id}`}
                      icon={BsBoxSeam}
                      isActive={location.pathname.includes(
                        `/products/${product.id}`
                      )}
                    />
                  ))}
                </CollapsableNavItem>
              ) : null}
              <CollapsableNavItem
                eventKey={settingIsOpen}
                title={<FormattedMessage id="Settings" />}
                icon={<BsGearFill />}
              >
                <NavItem
                  title={<FormattedMessage id="Health-Check" />}
                  link={`/settings/health-check`}
                  icon={BsFillClipboard2CheckFill}
                />
              </CollapsableNavItem>
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </SidebarWrapper>
  )
}
