import React, { useEffect, useState } from 'react'
import BreadcrumbComponent from '../../../components/custom/Shared/Breadcrumb/Breadcrumb'
import SafeFormatMessage from '../../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import TableHead from '../../../components/custom/Shared/TableHead/TableHead'
import { UppercaseMonthDateFormat } from '../../../lib/sharedFun/Time'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BsEnvelope, BsReplyAll, BsReplyFill } from 'react-icons/bs'
import { ReplayButton, Wrapper } from './ContactMessagesDetailsPage.styled'
import {
  Button,
  Card,
  Container,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import ReplayForm from '../ReplayForm/ReplayForm'
import useRequest from '../../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'

const ContactMessagesDetailsPage = () => {
  const [showReplayForm, setShowReplayForm] = useState(false)
  const [data, setData] = useState(null)
  const { getContactMessageById } = useRequest()
  const { id } = useParams()
  const [update, setUpdate] = useState(0)
  const handleReplay = () => {
    setShowReplayForm(true)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const funcResult = await getContactMessageById(id)
        setData(funcResult?.data?.data || null)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [update])

  return (
    <>
      {data && (
        <Wrapper>
          <BreadcrumbComponent
            breadcrumbInfo={'ContactMessagesDetails'}
            param1={data.id}
            data={{ name: data.subject }}
          />
          <TableHead search={false} button={false} title={data.subject} />
          <div className="main-container">
            <Container>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  <span className="fw-bold">{data.fullName}</span>
                  <span
                    className="mx-2"
                    style={{ color: 'var(--primary3)' }}
                  >{`<${data.email}>`}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="mx-2">
                    {UppercaseMonthDateFormat(data.createdDate, true, true)}{' '}
                  </span>
                  <ReplayButton>
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      overlay={
                        <Tooltip>
                          <SafeFormatMessage id="Replay" />
                        </Tooltip>
                      }
                    >
                      <BsReplyFill onClick={handleReplay} />
                    </OverlayTrigger>
                  </ReplayButton>
                </div>
              </div>
              <Card>
                <Card.Body>{data.message}</Card.Body>
              </Card>
              {showReplayForm ? (
                <div className="mt-3">
                  <span>
                    <SafeFormatMessage id="Replay-Message" />
                  </span>
                  <Card className="border-light" style={{ opacity: 0.8 }}>
                    <Card.Body className="p-2">
                      <ReplayForm
                        contactMessageId={data.id}
                        setVisible={setShowReplayForm}
                        setUpdate={setUpdate}
                        update={update}
                      />
                    </Card.Body>
                  </Card>
                </div>
              ) : data.replay ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold">
                      <SafeFormatMessage id="me:" />
                    </span>
                    <div className="mx-1">
                      {UppercaseMonthDateFormat(data.replyDate, true, true)}{' '}
                    </div>
                  </div>
                  <Card>
                    <Card.Body
                      className="p-2"
                      dangerouslySetInnerHTML={{ __html: data.replay }}
                    />
                  </Card>
                </>
              ) : (
                <Button
                  className="mt-1 small-btn"
                  onClick={handleReplay}
                  variant="secondary"
                >
                  <SafeFormatMessage id="Replay" /> <BsReplyFill />
                </Button>
              )}
            </Container>
          </div>
        </Wrapper>
      )}
    </>
  )
}

export default ContactMessagesDetailsPage
