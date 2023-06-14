import React, { useEffect, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";

export default function DeleteConfirmation({
  confirm,
  setConfirm,
  update,
  setUpdate,
  confirmFunction,
  message,
  icon,
}) {
  const dispatch = useDispatch();

  const accept = async () => {
    await confirmFunction();
    setConfirm(false);

    if (update) {
      console.log(update);
      setUpdate(update + 1);
    } else {
      dispatch(updateSidebar());
    }
  };

  const reject = () => {
    setConfirm(false);
  };

  return (
    <>
      <ConfirmDialog
        message={message}
        header="Confirmation"
        icon={icon}
        accept={accept}
        reject={reject}
        visible={confirm}
        onHide={() => setConfirm(false)}
      />
    </>
  );
}
