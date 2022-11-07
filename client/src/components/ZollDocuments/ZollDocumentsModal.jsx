import React, { useState, useEffect} from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";

import OtherDocumentsForm from "../Documents/OtherDocumentsForm";

function ZollDocumentsModal(props) {
  // Modal-State wird in Documents gehalten und über props manipuliert.

  //Debug Element
/*   useEffect(() => {
    console.log(props.transactionID_zoll)
  }, []) */
  return (
    <>
      <MDBModal
        show={props.basicModal}
        setShow={props.setBasicModal}
        tabIndex="-1"
      >
        <MDBModalDialog size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Dokument hinzufügen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={props.toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <OtherDocumentsForm
                isZoll={true}
                setSnackbarSuccess={props.setSnackbarSuccess}
                setSnackbarMessage={props.setSnackbarMessage}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleCloseSnackbar={props.handleCloseSnackbar}
                toggleAddDocumentModal={props.toggleShow}
                transactionId={props.transactionId}
                newDocument={props.reload}
                setNewDocument={props.setReload}
                transactionID_zoll={props.transactionID_zoll}

              />
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default ZollDocumentsModal;
