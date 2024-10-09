import React from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

export default function DeleteConfirmation({
  confirm,
  setConfirm,
  update,
  setUpdate,
  confirmFunction,
  message,
  icon,
}) {
  const accept = async () => {
    await confirmFunction()
    setConfirm(false)

    if (update) {
      setUpdate(update + 1)
    }
  }

  const reject = () => {
    setConfirm(false)
  }

  return (
    <>
      <ConfirmDialog
        message={message}
        header={<SafeFormatMessage id="Confirmation" />}
        rejectLabel={<SafeFormatMessage id="No" />}
        acceptLabel={<SafeFormatMessage id="Yes" />}
        icon={icon}
        accept={accept}
        reject={reject}
        visible={confirm}
        onHide={() => setConfirm(false)}
      />
    </>
  )
}
