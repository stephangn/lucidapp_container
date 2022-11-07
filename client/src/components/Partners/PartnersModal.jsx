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
import PartnerForm from "./PartnerForm";

export default function PartnersModal(props) {
  // Modal
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);

  return (
    <>
      <MDBBtn className="float-end" color="success" onClick={toggleShow}>
        <MDBIcon fas size="lg" icon="plus" className="me-2" />
        Partner hinzufügen
      </MDBBtn>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Partner hinzufügen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <PartnerForm
                partnerships={props.partnerships}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleCloseSnackbar={props.handleCloseSnackbar}
                setSnackbarSuccess={props.setSnackbarSuccess}
                setSnackbarMessage={props.setSnackbarMessage}
                toggleShow={toggleShow}
                newPartner={props.newPartner}
                setNewPartner={props.setNewPartner}
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
