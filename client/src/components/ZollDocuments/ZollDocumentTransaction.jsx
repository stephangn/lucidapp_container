import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardFooter,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
} from "mdb-react-ui-kit";
import { getZollanmeldung } from "../../Web3Client.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";

import MuiAlert from "@mui/material/Alert";
// Snackbar Alert

function ZollDocumentTransaction(props) {
  const axiosInstance = useAxiosPrivate();

  const [verified, setVerified] = useState(
    props.declarationData.status_verificiation
  );

  const [confirmation, setConfirmation] = useState(
    props.declarationData.status_confirmation
  );

  async function abgleichBlockchain(_blockchain_zid) {
    var crypto = require("crypto");
    console.log("Zollanmeldung ID:" + _blockchain_zid);

    await getZollanmeldung(_blockchain_zid) //blockchain Transaktion
      .then((tx) => {
        console.log(
          "Zollwert: " +
            tx[0].zollwert +
            ", " +
            (props.invoiceData.transport_costs + props.invoiceData.total_value)
        );
        //Abgleich Blockchain-Anwender
        if (
          tx[0].gesamtbetrag == props.invoiceData.total_value &&
          tx[0].zollwert ==
            props.invoiceData.transport_costs + props.invoiceData.total_value &&
          tx[0].lieferkosten == props.declarationData.invoice.transport_costs &&
          tx[0].incoterms == props.declarationData.lieferbedingung &&
          tx[0].exporteur == props.declarationData.exporteur.publickey &&
          tx[0].importeur == props.declarationData.importeur.publickey &&
          tx[0].zoll == props.declarationData.customs_office.publickey &&
          tx[0].anmelder == props.declarationData.importeur.publickey &&
          tx[1].gesamtbetrag == props.invoiceData.total_value &&
          tx[1].waehrung == props.declarationData.invoice.currency &&
          tx[1].exporteur == props.declarationData.exporteur.publickey &&
          tx[1].importeur == props.declarationData.importeur.publickey &&
          tx[1].datum == props.declarationData.invoice.issue_date &&
          tx[1].rechnungsposten ==
            crypto
              .createHash("sha512")
              .update(props.invoiceData.invoiceItem)
              .digest("hex") &&
          tx[1].lieferkosten == props.declarationData.invoice.transport_costs
        ) {
          console.log("Verifikation: Daten sind korrekt");
          // props.setIsVerified(true);
          axiosInstance.patch(
            "declaration_auth/" + props.declarationData.id + "/",
            { status_verificiation: "korrekt" }
          );
          props.handleCloseBackdrop();
          props.setSnackbarSuccess(true);
          props.setSnackbarMessage("Korrektheit der Daten wurde verifiziert.");
          props.handleOpenSnackbar();
          setVerified("korrekt");

          props.setReload(!props.reload);
          return true;
        } else {
          console.log("Verifikation: Fehler liegt vor");
          axiosInstance.patch(
            "declaration_auth/" + props.declarationData.id + "/",
            { status_verificiation: "inkorrekt" }
          );
          props.handleCloseBackdrop();
          props.setSnackbarSuccess(false);
          props.setSnackbarMessage(
            "Warnung: Daten stimmen nicht mit Blockchain überein."
          );
          props.handleOpenSnackbar();
          setVerified("inkorrekt");

          props.setReload(!props.reload);
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
        props.handleCloseBackdrop();
        props.setSnackbarSuccess(false);
        props.setSnackbarMessage("Fehler bei Verifikation der Daten.");
        return false;
      });
  }

  async function handleVerification() {
    //setIsVerified(true)
    props.handleToggleBackdrop();
    abgleichBlockchain(props.declarationData.blockchain_zid).then((res) => {
      console.log(res);
    });
  }

  function handleConfirmation() {
    axiosInstance
      .patch("declaration_auth/" + props.declarationData.id + "/", {
        status_confirmation: "bestätigt",
      })
      .then((res) => {
        console.log("Zollanmeldung bestätigt");
        toggleShowConfirmModal();
        props.setReload(!props.reload);
        // Snackbar
        props.setSnackbarSuccess(true);
        props.setSnackbarMessage("Zollanmeldung bestätigt.");
        props.handleOpenSnackbar();
        setConfirmation("bestätigt");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleReject() {
    axiosInstance
      .patch("declaration_auth/" + props.declarationData.id + "/", {
        status_confirmation: "abgelehnt",
      })
      .then((res) => {
        console.log("Zollanmeldung abgelehnt");
        toggleShowRejectModal();
        props.setReload(!props.reload);
        // Snackbar
        props.setSnackbarSuccess(false);
        props.setSnackbarMessage("Zollanmeldung abgelehnt.");
        props.handleOpenSnackbar();
        setConfirmation("abgelehnt");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Reject Modal State
  const [rejectModal, setRejectModal] = useState(false);

  function toggleShowRejectModal() {
    setRejectModal(!rejectModal);
  }

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState(false);

  function toggleShowConfirmModal() {
    setConfirmModal(!confirmModal);
  }

  return (
    <div>
      <MDBCard>
        <MDBCardBody>
          <MDBContainer>
            <MDBRow>
              <MDBCol>
                <MDBCardTitle>
                  {props.declarationData.transaction.description}
                </MDBCardTitle>
              </MDBCol>
            </MDBRow>
            <br />
          </MDBContainer>
          <MDBContainer>
            <MDBRow>
              <MDBCol>
                <MDBCardText>
                  <b>Versender</b>
                  <br />
                  {props.declarationData.exporteur.name}
                  <br />
                  {props.declarationData.exporteur.street}
                  <br />
                  {props.declarationData.exporteur.city_code}{" "}
                  {props.declarationData.exporteur.city},{" "}
                  {props.declarationData.exporteur.country_code}
                </MDBCardText>
              </MDBCol>
              <MDBCol>
                <MDBCardText>
                  <b>Empfänger / Anmelder</b>
                  <br />
                  {props.declarationData.importeur.name}
                  <br />
                  {props.declarationData.importeur.street}
                  <br />
                  {props.declarationData.importeur.city_code}{" "}
                  {props.declarationData.importeur.city},{" "}
                  {props.declarationData.importeur.country_code}
                </MDBCardText>
              </MDBCol>
              <MDBCol>
                <b>Anzahl Dokumente: </b>
                {/* +2 wegen Zollanmeldungs u. Rechnung */}
                {props.numberDocuments + 2}
                <br />
                <br />
                <b>Verifikation: </b>
                {/* {props.declarationData.status_verificiation} */}
                {verified}
                <br />
                <b>Status der Annmeldung: </b>
                {props.declarationData.status_confirmation}
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="8" lg="9">
                {verified == "ausstehend" && confirmation == "ausstehend" ? (
                  <MuiAlert severity="info" sx={{ my: 1 }}>
                    Neue Anmeldung liegt vor. Verifikation durchführen um
                    Zollanmeldung zu prüfen und zu bestätigen.
                  </MuiAlert>
                ) : null}
                {verified == "korrekt" && confirmation == "ausstehend" ? (
                  <MuiAlert severity="success" sx={{ my: 2 }}>
                    Korrektheit der Zollanmeldung wurde durch Blockchain
                    verifiziert. Annahme der Zollanmeldung ist möglich.
                  </MuiAlert>
                ) : null}
                {verified == "inkorrekt" && confirmation == "ausstehend" ? (
                  <MuiAlert severity="error" sx={{ my: 2 }}>
                    Daten stimmen nicht mit Blockchain überein und wurden
                    möglicherweise manipuliert. Prüfung erforderlich!
                  </MuiAlert>
                ) : null}
                {confirmation == "bestätigt" ? (
                  <MuiAlert severity="success" sx={{ my: 1 }}>
                    Zollanmeldung angenommen.
                  </MuiAlert>
                ) : null}
                {confirmation == "abgelehnt" ? (
                  <MuiAlert severity="error" sx={{ my: 1 }}>
                    Zollanmeldung abgelehnt.
                  </MuiAlert>
                ) : null}
              </MDBCol>
              <MDBCol md="4" lg="3">
                <div className="float-end">
                  {/* {props.isVerified ? (
                    <MDBBtn className="my-3">Daten sind verifiziert</MDBBtn>
                  ) : ( */}
                  <MDBBtn onClick={() => handleVerification()} className="my-3">
                    <MDBIcon
                      size="lg"
                      className="me-2"
                      fas
                      icon="fingerprint"
                    />
                    Daten verifizieren
                  </MDBBtn>
                  {/* )} */}
                </div>
              </MDBCol>
            </MDBRow>
            {confirmation == "ausstehend" && (
              <>
                {verified !== "ausstehend" ? (
                  <MDBRow>
                    <MDBBtn
                      className="mx-3 mb-3"
                      color="success"
                      style={{ width: 300 }}
                      onClick={toggleShowConfirmModal}
                    >
                      Anmeldung Bestätigen
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      className="mx-3 mb-3"
                      style={{ width: 300 }}
                      onClick={toggleShowRejectModal}
                    >
                      Anmeldung Ablehnen
                    </MDBBtn>
                  </MDBRow>
                ) : (
                  <MDBRow>
                    <MDBBtn
                      disabled
                      className="mx-3 mb-3"
                      color="success"
                      style={{ width: 300 }}
                      onClick={toggleShowConfirmModal}
                    >
                      Anmeldung Bestätigen
                    </MDBBtn>
                    <MDBBtn
                      disabled
                      color="danger"
                      className="mx-3 mb-3"
                      style={{ width: 300 }}
                      onClick={toggleShowRejectModal}
                    >
                      Anmeldung Ablehnen
                    </MDBBtn>
                  </MDBRow>
                )}
              </>
            )}
          </MDBContainer>
          <MDBCardFooter>
            <MDBRow>
              <MDBCol md="4">
                Hinzugefügt: {props.declarationData.transaction.date_added}
              </MDBCol>
              <MDBCol md="4">
                Zuletzt aktualisiert:{" "}
                {props.declarationData.transaction.date_processed}
              </MDBCol>
            </MDBRow>
          </MDBCardFooter>
        </MDBCardBody>
      </MDBCard>

      {/* Modal Anmeldung ablehnen */}
      <MDBModal show={rejectModal} setShow={setRejectModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Anmeldung ablehnen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShowRejectModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Wollen Sie die Zollanmeldung{" "}
              <i>{props.declarationData.transaction.description}</i> wirklich
              ablehnen? <br />
              Diese Auswahl lässt sich nicht rückgängig machen.
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="danger" onClick={handleReject}>
                Ablehnen
              </MDBBtn>
              <MDBBtn outline color="danger" onClick={toggleShowRejectModal}>
                Abbrechen
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Modal Anmeldung annehmen */}
      <MDBModal show={confirmModal} setShow={setConfirmModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Anmeldung annehmen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShowConfirmModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Wollen Sie die Zollanmeldung{" "}
              <i>{props.declarationData.transaction.description}</i> wirklich
              annehmen? <br />
              Diese Auswahl lässt sich nicht rückgängig machen.
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="success" onClick={handleConfirmation}>
                Annehmen
              </MDBBtn>
              <MDBBtn outline color="danger" onClick={toggleShowConfirmModal}>
                Abbrechen
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default ZollDocumentTransaction;
