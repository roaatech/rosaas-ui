import { Card, Col } from '@themesberg/react-bootstrap'

const GenerateCard = ({ title, icon, md, count, unit, variant }) => {
  return (
    <Col md={md}>
      <Card className="h-100 ">
        <Card.Body
          className="d-flex flex-column justify-content-center"
          style={{ backgroundColor: variant }}
        >
          <Card.Title className="text-center">
            <h5>
              <span
                style={{
                  marginRight: '10px',
                  marginLeft: '10px',
                  color: 'var(--second-color)',
                }}
              >
                {icon}
              </span>

              {title}
            </h5>
          </Card.Title>
          <div>
            <h1
              className="display-4 text-center"
              style={{ color: 'var(--second-color)' }}
            >
              {count}
            </h1>
            <p
              className="text-center fw-bold"
              style={{ color: 'var(--primary3)' }}
            >
              {unit}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
export default GenerateCard
