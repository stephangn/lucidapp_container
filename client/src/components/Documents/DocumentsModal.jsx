import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import InvoiceForm from "./InvoiceForm";
import OtherDocumentsForm from "./OtherDocumentsForm";

function DocumentsModal(props) {
  // Modal-State wird in Documents gehalten und über props manipuliert.

  const [fillActive, setFillActive] = useState("tab1");

  // Tab auswählen
  function handleFillClick(value) {
    if (value === fillActive) {
      return;
    }

    setFillActive(value);
  }

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
              <MDBTabs pills fill className="mb-3">
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab1")}
                    active={fillActive === "tab1"}
                  >
                    Rechnung
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab2")}
                    active={fillActive === "tab2"}
                  >
                    Sonstige
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>

              <MDBTabsContent>
                <MDBTabsPane show={fillActive === "tab1"}>
                  <InvoiceForm
                    transactionData={props.transactionData}
                    newDocument={props.newDocument}
                    setNewDocument={props.setNewDocument}
                    toggleAddDocumentModal={props.toggleAddDocumentModal}
                    handleOpenSnackbar={props.handleOpenSnackbar}
                    handleCloseSnackbar={props.handleCloseSnackbar}
                    setSnackbarSuccess={props.setSnackbarSuccess}
                    setSnackbarMessage={props.setSnackbarMessage}
                  />
                </MDBTabsPane>
                <MDBTabsPane show={fillActive === "tab2"}>
                  <OtherDocumentsForm
                    newDocument={props.newDocument}
                    setNewDocument={props.setNewDocument}
                    toggleAddDocumentModal={props.toggleAddDocumentModal}
                    handleOpenSnackbar={props.handleOpenSnackbar}
                    handleCloseSnackbar={props.handleCloseSnackbar}
                    setSnackbarSuccess={props.setSnackbarSuccess}
                    setSnackbarMessage={props.setSnackbarMessage}
                  />
                </MDBTabsPane>
              </MDBTabsContent>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default DocumentsModal;
