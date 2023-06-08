import React, { useEffect, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

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

  const accept = () => {
    confirmFunction();
    setConfirm(false);
    console.log(update);
    update && setUpdate(update + 2);
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
