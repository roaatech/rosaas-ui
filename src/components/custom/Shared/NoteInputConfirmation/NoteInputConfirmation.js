import React, { useState } from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { FormattedMessage } from 'react-intl'
import { GiTriangleTarget } from 'react-icons/gi'
import { BsExclamationTriangle } from 'react-icons/bs'

export default function NoteInputConfirmation({
  confirm,
  setConfirm,
  confirmFunction,
  message,
  icon,
  data,
}) {
  const [notes, setNotes] = useState('')

  const accept = async () => {
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
            <h6>
              {' '}
              <BsExclamationTriangle style={{ width: '30px' }} /> {message}
            </h6>
            <br />
            <input
              type="text"
              value={notes}
              className="form-control"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Description"
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
