import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './CreditCard.styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { MdOutlineStarBorder } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import Label from '../Shared/label/Label'
import { BsArrowRightCircleFill, BsTriangle } from 'react-icons/bs'

const CreditCard = ({
  cardNumber,
  expiryDate,
  cardHolder,
  isDefault,
  onSetAsDefault,
  onDelete,
  cardTypeIcon,
}) => {
  const numberWithDots = `••••••••••••${cardNumber}`
  const digits = numberWithDots.split('')

  return (
    <Wrapper>
      <Card className="credit-card">
        <Card.Body>
          <div className="top-row d-flex justify-content-between">
            {isDefault && (
              <div className="">
                <Label
                  {...{
                    background: '#ffab032b',
                    value: <FormattedMessage id="Default" />,
                  }}
                />
              </div>
            )}
            <div className=" icon ms-auto">{cardTypeIcon}</div>
          </div>
          <Card.Text className="card-number">
            {digits.map((digit, index) => (
              <span
                key={index}
                className={digit === '•' ? 'dot digit' : 'digit'}
              >
                {digit}
              </span>
            ))}
          </Card.Text>
          <div className="bottom-row">
            <div className="right">{cardHolder}</div>
            <div className="left">
              {' '}
              <BsArrowRightCircleFill /> {expiryDate}
            </div>
          </div>
          <div className="d-flex justify-content-end pb-0 mb-0 group">
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                as={Button}
                split
                variant="link"
                className="text-dark m-0 p-0 "
              >
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
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
                  <FormattedMessage id="Set-As-Default" />
                </Dropdown.Item>
                <Dropdown.Item className="text-danger" onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                  <FormattedMessage id="Delete" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default CreditCard
