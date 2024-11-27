import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../axios/apis/useRequest'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './ReplayForm.styled'
import { Button, Form, Modal } from '@themesberg/react-bootstrap'
import { Editor } from 'primereact/editor'
import { useEffect } from 'react'

const ReplayForm = ({ contactMessageId, setVisible, setUpdate, update }) => {
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
        setUpdate(update + 1)
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
        <Modal.Body>
          <Form.Group className=" mb-2">
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
          <Button
            className=""
            variant="secondary"
            type="submit"
            disabled={isSubmitting}
          >
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
