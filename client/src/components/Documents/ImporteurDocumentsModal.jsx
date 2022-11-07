import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";

import OtherDocumentsForm from "./OtherDocumentsForm";

function ImporteurDocumentsModal(props) {
  // Modal-State wird in Documents gehalten und über props manipuliert.

  return (
    <>
      <MDBModal
        show={props.addDocumentModal}
        setShow={props.setAddDocumentModal}
        tabIndex="-1"
      >
        <MDBModalDialog size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Dokument hinzufügen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={props.toggleAddDocumentModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <OtherDocumentsForm
                newDocument={props.newDocument}
                setNewDocument={props.setNewDocument}
                toggleAddDocumentModal={props.toggleAddDocumentModal}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleCloseSnackbar={props.handleCloseSnackbar}
                setSnackbarSuccess={props.setSnackbarSuccess}
                setSnackbarMessage={props.setSnackbarMessage}
              />
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default ImporteurDocumentsModal;
