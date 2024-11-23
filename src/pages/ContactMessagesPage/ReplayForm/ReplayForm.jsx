import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../axios/apis/useRequest'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './ReplayForm.styled'
import { Button, Form, Modal } from '@themesberg/react-bootstrap'
import { Editor } from 'primereact/editor'

const ReplayForm = ({ contactMessageId, setVisible, popupLabel }) => {
  const { replayContactMessageById } = useRequest()
  const [editorContent, setEditorContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validationSchema = Yup.object().shape()

  const formik = useFormik({
    initialValues: {
      replay: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setIsSubmitting(true)
        await replayContactMessageById(contactMessageId, {
          replay: editorContent?.htmlValue,
        })
        setVisible(false)
      } catch (error) {
        console.error('Error sending replay:', error)
      } finally {
        setSubmitting(false)
        setIsSubmitting(false)
      }
    },
  })

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
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Replay-Message" />
            </Form.Label>

            <Editor
              value={editorContent}
              onTextChange={(content) => {
                setEditorContent(content)
                formik.setFieldValue('replay', content)
              }}
              style={{ height: '320px' }}
            />

            {formik.touched.replay && formik.errors.replay && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.replay}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <FormattedMessage id="Submitting..." />
            ) : (
              <FormattedMessage id="Submit" />
            )}
          </Button>
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default ReplayForm
