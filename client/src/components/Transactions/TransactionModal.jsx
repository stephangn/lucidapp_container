import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
} from "mdb-react-ui-kit";
import TransactionForm from "./TransactionForm";

export default function TransactionModal(props) {
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);

  return (
    <>
      <MDBBtn className="float-end" color="success" onClick={toggleShow}>
        <MDBIcon fas size="lg" icon="plus" className="me-2" />
        Transaktion hinzufügen
      </MDBBtn>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Transaktionen hinzufügen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <TransactionForm
                setreload={props.setreload}
                reload={props.reload}
                toggleShow={toggleShow}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleCloseSnackbar={props.handleCloseSnackbar}
                setSnackbarSuccess={props.setSnackbarSuccess}
                setSnackbarMessage={props.setSnackbarMessage}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn outline color="danger" onClick={toggleShow}>
                Abbrechen
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
