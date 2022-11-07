import { React } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";

// ALT - Nicht mehr in Gebrauch
function CardModal(props) {
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
              <MDBModalTitle>{props.title}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={props.toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBContainer>
                <MDBRow>
                  <MDBCol></MDBCol>
                  <MDBCol>{props.description}</MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="danger" onClick={props.toggleShow}>
                Schließen
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default CardModal;
