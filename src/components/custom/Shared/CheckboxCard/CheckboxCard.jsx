import { Card } from '@themesberg/react-bootstrap'
import { useState } from 'react'
import { BsCheckCircleFill } from 'react-icons/bs'
import { Wrapper } from './CheckboxCard.styled'

const CheckboxCard = ({ label, value, onChange }) => {
  const [isChecked, setIsChecked] = useState(value)

  const toggleCheckbox = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <Wrapper>
      <Card
        className={`checkbox-card ${value ? 'checked' : ''}`}
        onClick={toggleCheckbox}
      >
        <Card.Body>
          <Card.Title>
            {label}
            {value && (
              <div className="check-circle">
                <BsCheckCircleFill />
              </div>
            )}
          </Card.Title>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default CheckboxCard
