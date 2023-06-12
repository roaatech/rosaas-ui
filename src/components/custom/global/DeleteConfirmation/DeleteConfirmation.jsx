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
  //   useEffect(() => {
  //     if (confirm) {
  //       confirm2();
  //     }
  //   }, [confirm]);

  const toast = useRef(null);
  const dispatch = useDispatch();

  const accept = async () => {
    await confirmFunction();
    setConfirm(false);
    dispatch(updateSidebar());

    if (update) {
      console.log(update);
      setUpdate(update + 1);
    }
  };

  const reject = () => {
    setConfirm(false);
  };

  //   const confirm2 = () => {
  //     confirmDialog({
  //       message: "Do you want to delete this Tenant?",
  //       header: "Delete Confirmation",
  //       //   icon: "pi pi-info-circle",
  //       acceptClassName: "p-button-danger",
  //       accept,
  //       reject,
  //     });
  //   };

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
