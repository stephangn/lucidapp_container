import React, { Component, useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBIcon,
  MDBCardFooter,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBDropdownHeader,
} from "mdb-react-ui-kit";
import Inbound from "../../icons/inbound.png";
import Outbound from "../../icons/outbound.png";

import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import MuiAlert from "@mui/material/Alert";

function Transaction(props) {
  const { auth } = useAuth();

  // State: Importeur oder Exporteur
  const [isImporteur, setIsImporteur] = useState(false);

  // State: Anzahl Dokumente
  const [numberDocuments, setNumberDocuments] = useState(0);

  // State: Anzahl Rechnungen
  const [numberInvoices, setNumberInvoices] = useState(0);

  const axiosInstance = useAxiosPrivate();

  // Funktion überprüft ob Importeur oder Exporteur
  useEffect(() => {
    if (auth.eori_nr == props.importeur) {
      setIsImporteur(true);
    }
  });

  // Abgleich Anzahl Dokumente für Transaktion
  useEffect(() => {
    let documents = props.documentsData;
    let anzahlDokumente = 0;
    let anzahlRechnungen = 0;
    if (documents.length !== 0) {
      for (let i in documents) {
        if (documents[i].transaction == props.id) {
          // Wenn Dokument Transaktion angehört summiere Dokumente
          anzahlDokumente += 1;
          // Wenn Dokument == Rechnung summmiere Rechnungen
          if (documents[i].type == "Rechnung") {
            anzahlRechnungen += 1;
          }
        }
      }
      setNumberDocuments(anzahlDokumente);
      setNumberInvoices(anzahlRechnungen);
    }
  }, [props.documentsData]);

  // State: Zollanmeldung vorhanden
  const [declarationExists, setDeclarationExists] = useState(false);
  // State: Status Zollanmeldung
  const [confirmation, setConfirmation] = useState("ausstehend");

  // Prüfen ob Zollanmeldung vorliegt
  useEffect(() => {
    let declaration = props.declarationData;
    let anmeldungVorhanden = false;
    if (declaration.length !== 0) {
      for (let i in declaration) {
        if (declaration[i].transaction == props.id) {
          // Wenn Anmeldung Transaktion angehört setze auf true
          anmeldungVorhanden = true;
          // Status Zollanmeldung abfragen
          setConfirmation(declaration[i].status_confirmation);
        }
      }
      setDeclarationExists(anmeldungVorhanden);
    }
  }, [props.declarationData]);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState(false);

  function toggleShowDeleteModal() {
    setDeleteModal(!deleteModal);
  }

  // Delete-Request an DB

  function deleteTransaction() {
    axiosInstance
      .delete("transactions/" + props.id + "/")
      .then((res) => {
        //console.log("Transaktion gelöscht");
      })
      .catch((err) => {
        //console.log(err);
      });
  }

  // Edit Modal State
  const [editModal, setEditModal] = useState(false);

  function toggleShowEditModal() {
    setEditModal(!editModal);
  }

  // In die Funktion Post-Request für aktualisierte Beschreibung
  // Beschreibung ist 'description' ; Transaktions-ID ist 'props.id'
  const [description, setDescription] = useState(props.title);

  // Submit Bearbeitung
  function handleEditSubmit(e) {
    e.preventDefault();

    axiosInstance
      .patch("transactions/" + props.id + "/", { description: description })
      .then((res) => {
        //console.log("Transaktion geändert");
      })
      .catch((err) => {
        //console.log(err);
      });
  }

  return (
    <div>
      <MDBCard>
        <MDBCardBody>
          <MDBContainer>
            <MDBCardTitle>
              {isImporteur ? "Import: " : "Export: "}
              {props.title}
              {/* <MDBIcon className="float-end" size="lg" fas icon="ellipsis-h" /> */}
              <MDBDropdown className="float-end">
                <MDBDropdownToggle outline>
                  <MDBIcon size="lg" fas icon="edit" />
                </MDBDropdownToggle>
                {declarationExists ? (
                  <MDBDropdownMenu>
                    <MDBDropdownItem>
                      <MDBDropdownHeader>
                        Zollanmeldung liegt bereits vor. <br /> Bearbeitung
                        nicht mehr möglich.
                      </MDBDropdownHeader>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <MDBDropdownLink
                        className="disabled"
                        onClick={toggleShowEditModal}
                      >
                        <MDBIcon className="me-2" fas icon="edit" />
                        Bearbeiten
                      </MDBDropdownLink>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <MDBDropdownLink
                        className="disabled"
                        onClick={toggleShowDeleteModal}
                      >
                        <MDBIcon className="me-2" fas icon="trash-alt" />
                        Löschen
                      </MDBDropdownLink>
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                ) : (
                  <MDBDropdownMenu>
                    <MDBDropdownItem>
                      <MDBDropdownLink onClick={toggleShowEditModal}>
                        <MDBIcon className="me-2" fas icon="edit" />
                        Bearbeiten
                      </MDBDropdownLink>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <MDBDropdownLink onClick={toggleShowDeleteModal}>
                        <MDBIcon className="me-2" fas icon="trash-alt" />
                        Löschen
                      </MDBDropdownLink>
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                )}
              </MDBDropdown>
            </MDBCardTitle>

            <MDBCardSubTitle>
              Hinzugefügt am: {props.added} (
              {props.timestamp_added.slice(11, 19)})
            </MDBCardSubTitle>
            <br />
          </MDBContainer>
          <MDBContainer>
            <MDBRow>
              <MDBCol sm="2" className="d-flex justify-content-center">
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={isImporteur ? Inbound : Outbound}
                />

                {/* <MDBIcon fas icon="clipboard-list" size="4x" className="mt-3" /> */}
              </MDBCol>
              <MDBCol sm="5">
                <MDBCardText className="mb-3">
                  <b>Handelspartner{isImporteur && " (Exporteur)"}</b>
                  <br />
                  {props.exportAddress}
                  <br />
                  {props.exportStreet}
                  <br />
                  {props.exportCity}, {props.exportCountry}
                </MDBCardText>
              </MDBCol>
              <MDBCol sm="5">
                <MDBCardText className="mb-2">
                  <b>Dokumente insgesamt: </b>
                  {numberDocuments}
                  <br />
                  <b>Rechnungsdokumente: </b>
                  {numberInvoices}
                  <br />
                  <b>Zollanmeldung: </b>
                  {declarationExists ? "liegt vor" : "ausstehend"}
                  <br />
                  <b>Zollbescheid: </b>
                  {confirmation}
                </MDBCardText>
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="8" lg="8">
                {numberInvoices == 0 ? (
                  <MuiAlert severity="info" sx={{ my: 1 }}>
                    Transaktion angelegt. Rechnung hochladen, um Zollanmeldung
                    durchführen zu können.
                  </MuiAlert>
                ) : numberInvoices !== 0 && declarationExists == false ? (
                  <MuiAlert severity="warning" sx={{ my: 1 }}>
                    Rechnung liegt vor. Zollanmeldung ist möglich.
                  </MuiAlert>
                ) : declarationExists == true &&
                  confirmation == "ausstehend" ? (
                  <MuiAlert severity="info" sx={{ my: 1 }}>
                    Zollanmeldung abgeschickt. Warte auf Bearbeitung der
                    Zollanmeldung.
                  </MuiAlert>
                ) : confirmation == "bestätigt" ? (
                  <MuiAlert severity="success" sx={{ my: 1 }}>
                    Zollanmeldung angenommen.
                  </MuiAlert>
                ) : confirmation == "abgelehnt" ? (
                  <MuiAlert severity="error" sx={{ my: 1 }}>
                    Zollanmeldung abelehnt.
                  </MuiAlert>
                ) : null}
              </MDBCol>
              <MDBCol md="4" lg="4">
                <Link
                  style={{ display: "block", margin: "1rem 0" }}
                  to={"/transactions/" + props.id.toString()}
                  key={props.id}
                  params={{ title: "Hello" }}
                >
                  <MDBBtn className="float-end">
                    <MDBIcon size="lg" className="me-2" far icon="file" />
                    Dokumente anzeigen
                  </MDBBtn>
                </Link>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBCardFooter>
            Zuletzt aktualisiert: {props.lastChange} (
            {props.timestamp_processed.slice(11, 19)})
          </MDBCardFooter>
        </MDBCardBody>
      </MDBCard>

      {/* Delete Modal */}
      <MDBModal show={deleteModal} setShow={setDeleteModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Auftrag entfernen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShowDeleteModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Wollen sie den Auftrag <b>"{props.title}"</b> wirklich entfernen?
              Dieser Vorgang lässt sich nicht rückgängig machen.
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="danger" onClick={toggleShowDeleteModal}>
                Nicht entfernen
              </MDBBtn>
              <MDBBtn outline color="danger" onClick={deleteTransaction}>
                Entfernen
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Edit Modal */}
      <MDBModal show={editModal} setShow={setEditModal}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Auftrag umbenennen</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShowEditModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBContainer>
                <form onSubmit={handleEditSubmit}>
                  <MDBInput
                    name="description"
                    label="Beschreibung der Transaktion"
                    type="text"
                    className="mt-2"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                  <MDBRow>
                    <MDBBtn type="submit" color="success" className="mt-4 mb-2">
                      Speichern
                    </MDBBtn>
                  </MDBRow>
                </form>
              </MDBContainer>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="danger" onClick={toggleShowEditModal}>
                Abbrechen
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default Transaction;
