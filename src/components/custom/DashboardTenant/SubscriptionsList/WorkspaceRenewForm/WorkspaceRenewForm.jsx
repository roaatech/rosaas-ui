import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from './WorkspaceRenewForm.styled.jsx'
import { FormattedMessage } from 'react-intl'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { ListBox } from 'primereact/listbox'
import { cardInfo } from '../../../../../const/cardPayment.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  addAutoRenewal,
  changeSubscriptionAttribute,
  setAllpaymentCards,
} from '../../../../../store/slices/workSpace.js'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

const WorkspaceRenewForm = ({
  setVisible,
  popupLabel,
  currentSubscription,
  referenceId,
  // cards,
  setCards,
  setShowAddCardForm,
}) => {
  const cards = useSelector((state) => state.workspace.paymentCards)
  const { setAutoRenewal, getPaymentCardsList } = useRequest()
  const [submitLoading, setSubmitLoading] = useState()
  const subscriptionData = useSelector(
    (state) => state.workspace.subscriptionData
  )
  const validationSchema = Yup.object().shape({
    card: Yup.string().required(
      <SafeFormatMessage id="Please-select-a-card" />
    ),
  })

  const initialValues = {
    card: referenceId ? referenceId : '',
  }
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitLoading(true)
      try {
        await setAutoRenewal({
          subscriptionId: currentSubscription,
          cardReferenceId: values.card,
          paymentPlatform: 2,
        })
        dispatch(
          changeSubscriptionAttribute({
            subscriptionId: currentSubscription,
            attributeName: 'autoRenewalIsEnabled',
            attributeValue: true,
          })
        )
        dispatch(
          addAutoRenewal({
            id: currentSubscription,
            ...subscriptionData[currentSubscription],
          })
        )
        setVisible && setVisible(false)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        setSubmitLoading(false)
      }
    },
  })

  useEffect(() => {
    if (Object.keys(cards).length > 0) {
      return
    }
    ;(async () => {
      const fetchedCardsData = await getPaymentCardsList()
      dispatch(setAllpaymentCards(fetchedCardsData.data.data))
    })()
  }, [])

  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <SafeFormatMessage id="Payment-Card" />
                </Form.Label>
                <ListBox
                  value={formik.values.card}
                  options={
                    cards &&
                    Object.values(cards).map((card) => ({
                      // Use the list of cards from state
                      value: card.stripeCardId,
                      label: (
                        <div className="d-flex ">
                          <div
                            className="d-flex align-items-center"
                            style={{ minWidth: '110px' }}
                          >
                            {cardInfo?.[card.brand]?.icon}
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="icon-dark pl-3"
                            />
                            <span className="pl-1">{card.last4Digits}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              className="px-3"
                              style={{ flex: '0 0 100%', minWidth: '100px' }}
                            >
                              {card.cardholderName}
                            </span>
                            <span className="d-flex justify-content-end">
                              {card.expirationMonth}/{card.expirationYear}
                            </span>
                          </div>
                        </div>
                      ),
                    }))
                  }
                  onChange={(e) => formik.setFieldValue('card', e.value)}
                  optionLabel="label"
                  className="form-control p-0"
                  // virtualScrollerOptions={{ itemSize: 300 }}
                  listStyle={{ height: '200px' }}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group className="mb-3">
                <span
                  className=""
                  style={{
                    color: 'var(--second-color)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    setShowAddCardForm(true)
                    setVisible(false)
                  }}
                >
                  + Add Another Card
                </span>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit" disabled={submitLoading}>
            <SafeFormatMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default WorkspaceRenewForm
