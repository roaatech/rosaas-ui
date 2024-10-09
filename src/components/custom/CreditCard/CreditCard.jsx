import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './CreditCard.styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisH,
  faEllipsisV,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { MdError, MdOutlineStarBorder } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import Label from '../Shared/label/Label'
import { BsArrowRightCircleFill, BsTriangle } from 'react-icons/bs'
import SafeFormatMessage from '../Shared/SafeFormatMessage/SafeFormatMessage'

const CreditCard = ({
  cardNumber: last4Digits,
  expiryDate,
  cardHolder,
  isDefault,
  onSetAsDefault,
  onDelete,
  cardTypeIcon,
  cardView,
}) => {
  const numberWithDots = last4Digits ? `••••••••••••${last4Digits}` : ''
  const digits = numberWithDots.split('')

  const dataAvailable = last4Digits && expiryDate && cardHolder && cardTypeIcon

  return (
    <Wrapper>
      <Card
        className={
          cardView
            ? `credit-card-view credit-card${
                !dataAvailable ? 'not-available' : ''
              }`
            : `credit-card credit-card-hover${
                !dataAvailable ? 'not-available' : ''
              }`
        }
      >
        <Card.Body>
          {!dataAvailable ? (
            <div className="payment-info-not-available py-5">
              {' '}
              <MdError />
              <h3 className="payment-info-not-available">
                <SafeFormatMessage id="payment-Info-Not-Available" />
              </h3>
            </div>
          ) : (
            <>
              <div
                className={
                  !cardView
                    ? 'top-row d-flex justify-content-between'
                    : 'top-row  top-row-view d-flex justify-content-between'
                }
              >
                {!cardView && (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      as={Button}
                      split
                      variant="link"
                      className="text-dark m-0 p-0"
                    >
                      <span className="icon icon-sm">
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className="icon-dark px-2"
                        />
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      popperConfig={{
                        strategy: 'fixed',
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, 10],
                            },
                          },
                          {
                            name: 'preventOverflow',
                            options: {
                              boundary: 'viewport',
                            },
                          },
                        ],
                      }}
                    >
                      <Dropdown.Item onClick={onSetAsDefault}>
                        <MdOutlineStarBorder />
                        <SafeFormatMessage id="Set-As-Default" />
                      </Dropdown.Item>
                      <Dropdown.Item className="text-danger" onClick={onDelete}>
                        <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                        <SafeFormatMessage id="Delete" />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                {isDefault && (
                  <div className="">
                    <Label
                      {...{
                        background: '#ffffffa1',
                        value: <SafeFormatMessage id="Default" />,
                      }}
                    />
                  </div>
                )}
                <div className="icon ms-auto my-0 py-0">{cardTypeIcon}</div>
              </div>
              <Card.Text
                className={
                  !cardView ? 'card-number' : 'card-number card-number-view'
                }
              >
                {digits.map((digit, index) => (
                  <span
                    key={index}
                    className={digit === '•' ? 'dot digit' : 'digit'}
                  >
                    {digit}
                  </span>
                ))}
              </Card.Text>
              <div
                className={
                  !cardView ? 'bottom-row' : 'bottom-row bottom-row-view'
                }
              >
                <div className="right">{cardHolder}</div>
                <div className="">
                  {' '}
                  <BsArrowRightCircleFill /> {expiryDate}
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default CreditCard
