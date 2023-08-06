import React from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'
// import { Toast } from "primereact/toast";
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'

export default function DeleteConfirmation({
  confirm,
  setConfirm,
  update,
  setUpdate,
  confirmFunction,
  message,
  icon,
  sideBar,
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
        header={<FormattedMessage id="Confirmation" />}
        rejectLabel={<FormattedMessage id="No" />}
        acceptLabel={<FormattedMessage id="Yes" />}
        icon={icon}
        accept={accept}
        reject={reject}
        visible={confirm}
        onHide={() => setConfirm(false)}
      />
    </>
  )
}
