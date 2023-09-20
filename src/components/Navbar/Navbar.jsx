import React, { useState } from 'react'
import {
  Row,
  Col,
  Nav,
  Form,
  Image,
  Navbar,
  Dropdown,
  Container,
  ListGroup,
  InputGroup,
} from '@themesberg/react-bootstrap'

import NOTIFICATIONS_DATA from '../../data/notifications'
import Profile3 from '../../assets/img/team/profile-picture.png'
import Profile1 from '../../assets/img/team/profile-picture-1.png'
import useGlobal from '../../lib/hocks/global'
import { useSelector } from 'react-redux'
import { logOut } from '../../store/slices/auth'
import { useDispatch } from 'react-redux'
import { changeMode, directionFun } from '../../store/slices/main'
import { useDarkreader } from 'react-darkreader'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './Navbar.styled'
// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const dispatch = useDispatch()
  const { changeDirection } = useGlobal()
  const direction = useSelector((state) => state.main.direction)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const darkMode = useSelector((state) => state.main.darkMode)
  const [isDark, { toggle }] = useDarkreader(darkMode)
  const xDirection = direction === 'rtl' ? 'ltr' : 'rtl'
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA)
  const areNotificationsRead = notifications.reduce(
    (acc, notif) => acc && notif.read,
    true
  )

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
    }, 300)
  }

  const Notification = (props) => {
    const { link, sender, image, time, message, read = false } = props
    const readClassName = read ? '' : 'text-danger'

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image
              src={image}
              className="user-avatar lg-avatar rounded-circle"
            />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{time}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    )
  }

  return (
    <Wrapper>
      <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
        <Container fluid className="px-0">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center"></div>
            <Nav className="align-items-center">
              <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead}>
                <Dropdown.Toggle
                  as={Nav.Link}
                  className="text-dark icon-notifications me-lg-3"
                ></Dropdown.Toggle>
                <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                  <ListGroup className="list-group-flush">
                    <Nav.Link
                      href="#"
                      className="text-center text-primary fw-bold border-bottom border-light py-3"
                    >
                      Notifications
                    </Nav.Link>

                    {notifications.map((n) => (
                      <Notification key={`notification-${n.id}`} {...n} />
                    ))}

                    <Dropdown.Item className="text-center text-primary fw-bold py-3">
                      View all
                    </Dropdown.Item>
                  </ListGroup>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0 p-info">
                  <div className="media d-flex align-items-center">
                    <Image
                      src={darkMode ? Profile1 : Profile3}
                      className="user-avatar md-avatar rounded-circle"
                    />
                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                      <span className="mb-0 font-small fw-bold email">
                        {userInfo.email}
                      </span>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  {/* <Dropdown.Item
                  className="fw-bold"
                  onClick={() => {
                    dispatch(changeMode(!darkMode))
                    toggle()
                  }}
                >
                  {darkMode == false ? 'Dark Mode' : 'Light Mode'}
                </Dropdown.Item> */}

                  {/* <Dropdown.Divider /> */}

                  <Dropdown.Item
                    className="fw-bold"
                    onClick={() => {
                      dispatch(
                        directionFun(direction === 'rtl' ? 'ltr' : 'rtl')
                      )
                    }}
                  >
                    {direction === 'rtl' ? (
                      <FormattedMessage id="AR" />
                    ) : (
                      <FormattedMessage id="EN" />
                    )}
                  </Dropdown.Item>

                  <Dropdown.Item
                    className="fw-bold"
                    onClick={() => dispatch(logOut())}
                  >
                    {/* <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-danger mx-2"
                  /> */}
                    <FormattedMessage id="Logout" />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </Wrapper>
  )
}
