import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";

function Partner(props) {
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState(false);

  function toggleShowDeleteModal() {
    setDeleteModal(!deleteModal);
  }

  const axiosInstance = useAxiosPrivate();

  // Hier Delete-Request von props.id
  function deletePartnership() {
    axiosInstance
      .patch(`partnership/` + props.id_relation + "/", { is_archived: true })
      .then((res) => {
        props.setSnackbarSuccess(true);
        props.setSnackbarMessage("Partner wurde entfernt.");
        props.setReload(!props.reload);
        toggleShowDeleteModal();
        props.handleOpenSnackbar();
      })
      .catch((err) => {
        //console.log(err.response);
        props.setSnackbarSuccess(false);
        props.setSnackbarMessage("Fehler beim Entfernen des Partners.");
        props.setReload(!props.reload);
        toggleShowDeleteModal();
        props.handleOpenSnackbar();
      });
  }

  return (
    <>
      <MDBCard>
        <MDBCardBody>
          <MDBContainer>
            <MDBRow>
              <MDBCol>
                <MDBCardTitle>{props.title}</MDBCardTitle>
              </MDBCol>
              <MDBCol>
                <MDBBtn
                  outline
                  floating
                  className="float-end"
                  color="danger"
                  onClick={toggleShowDeleteModal}
                >
                  <MDBIcon fas icon="trash-alt" size="lg" />
                </MDBBtn>
              </MDBCol>
            </MDBRow>

            <MDBCardSubTitle>
              <i>Hinzugefügt am {props.added}</i>
            </MDBCardSubTitle>
            <br />
          </MDBContainer>
          <MDBContainer>
            <MDBRow>
              <MDBCol>
                <MDBCardText>
                  {props.addressStreet}
                  <br />
                  {props.addressCity} <br />
                  {props.addressCountry}
                </MDBCardText>
              </MDBCol>
              <MDBCol>
                <MDBCardText>
                  📧 {props.email}
                  <br />☎ {props.phone}
                  <br />
                  EORI-Nr.: {props.eori}
                </MDBCardText>
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="8" lg="9"></MDBCol>
              <MDBCol md="4" lg="3">
                <Link
                  style={{ display: "block", margin: "1rem 0" }}
                  to={"/partners/" + props.id_relation.toString()}
                  key={props.id_relation}
                  params={{ title: "Hello" }}
                >
                  <MDBBtn outline className="float-end">
                    Auftragsübersicht
                  </MDBBtn>
                </Link>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBCardBody>
      </MDBCard>

      <MDBModal show={deleteModal} setShow={setDeleteModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Handelspartner entfernen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShowDeleteModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Wollen sie den Handelspartner <b>"{props.title}"</b> wirklich aus
              ihren bestehenden Handelsbeziehungen entfernen? <br /> <br />
              Um danach wieder einen Handel mit diesem Partner eingehen zu
              können, müssen Sie erneut eine Handelsbeziehung etablieren. <br />{" "}
              <br />
              (Hinweis: Die dem Partner zugeordneten Aufträge bleiben auch nach
              entfernen des Partners erhalten.)
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="danger" onClick={toggleShowDeleteModal}>
                Nicht entfernen
              </MDBBtn>
              <MDBBtn outline color="danger" onClick={deletePartnership}>
                Entfernen
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default Partner;
