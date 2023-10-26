import React, { useEffect, useState } from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { FormattedMessage } from 'react-intl'
import { GiTriangleTarget } from 'react-icons/gi'
import { BsExclamationTriangle } from 'react-icons/bs'
import DescriptionCell from '../DescriptionCell/DescriptionCell'
import { TextareaCounterWrapper } from '../TextareaAndCounter/TextareaAndCounter.styled'
import TextareaAndCounter from '../TextareaAndCounter/TextareaAndCounter'

export default function NoteInputConfirmation({
  confirm,
  setConfirm,
  confirmFunction,
  message,
  icon,
  data,
  placeholder,
}) {
  const [notes, setNotes] = useState('')

  const accept = async () => {
    // alert(notes)
    await confirmFunction(data, notes)
    setConfirm(false)
    setNotes('')
  }

  const reject = () => {
    setConfirm(false)
    setNotes('')
  }

  return (
    <>
      <ConfirmDialog
        message={
          <>
            <h6 className="mr-1">
              {' '}
              <BsExclamationTriangle
                className="mb-1"
                style={{ width: '20px' }}
              />{' '}
              {message}
            </h6>
            <br />

            <TextareaAndCounter
              maxLength="250"
              showCharCount="true"
              inputValue={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={placeholder}
            />
          </>
        }
        icon={icon}
        header={<FormattedMessage id="Confirmation" />}
        rejectLabel={<FormattedMessage id="No" />}
        acceptLabel={<FormattedMessage id="Yes" />}
        accept={accept}
        reject={reject}
        visible={confirm}
        onHide={() => {
          setConfirm(false)
          setNotes('')
        }}
      />
    </>
  )
}
