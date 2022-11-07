import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./css/LoadingSpinner.css";
import {
  MDBContainer,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBSpinner,
  MDBBadge,
  MDBIcon,
} from "mdb-react-ui-kit";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import DocumentsModal from "../components/Documents/DocumentsModal";
import ImporteurDocumentsModal from "../components/Documents/ImporteurDocumentsModal";
import DocumentTransaction from "../components/Documents/DocumentTransaction";
import DocumentCard from "../components/Documents/DocumentCard";
import DeclarationCard from "../components/Documents/DeclarationCard";
import DocumentBreadcrump from "../components/Documents/DocumentBreadcrumb";
import useAuth from "../hooks/useAuth";

// Snackbar-Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DocumentsNew(props) {
  // Für Rückkehr von Zollanmeldung
  let location = useLocation();
  let declarationLocationState = location.state;
  console.log(declarationLocationState);

  // Auslösen des Snackbar-Alerts bei Rückerkehr von Zollanmeldung
  useEffect(() => {
    console.log(declarationLocationState);
    if (declarationLocationState !== null) {
      setSnackbarSuccess(declarationLocationState.success);
      setSnackbarMessage(declarationLocationState.message);
      handleOpenSnackbar();
    }
  }, [declarationLocationState]);

  // Allgemeine Auftragsinformationen
  const [transactionData, setTransactionData] = useState([]);

  // Informationen der hochgeladenen Dokumente
  const [documentsData, setDocumentsData] = useState([]);

  // State für Ladeanimation
  const [isLoading, setIsLoading] = useState(true);

  const axiosInstance = useAxiosPrivate();

  // Derzeitiger User ist Importeur oder Exporteur
  const [isImporteur, setIsImporteur] = useState(false);

  // State wird in Document Upload Modal weitergereicht.
  // Löst useEffect aus, sobald neues Dokument hochgeladen wurde.
  const [newDocument, setNewDocument] = useState(false);

  const [isDeclaration, setIsDeclaration] = useState(false);
  const [declarationData, setDeclarationData] = useState();
  const [totalValue, setTotalValue] = useState(true);
  const [invoiceData, setInvoiceData] = useState();
  const [isInvoice, setIsInvoice] = useState();

  // Anzahl Dokumente
  const [numberInvoiceDocuments, setNumberInvoiceDocuments] = useState(0);
  const [numberOtherDocuments, setNumberOtherDocuments] = useState(0);

  // State für "Dokument hinzufügen" Modal
  const [addDocumentModal, setAddDocumentModal] = useState(false);
  // Funktion für Manipulation von Modal (als props weitergereicht)
  function toggleAddDocumentModal() {
    setAddDocumentModal(!addDocumentModal);
  }

  // Speichern der Transaktions-ID aus URL
  const { transactionId } = useParams();
  const { auth } = useAuth();

  // DB Call
  useEffect(async () => {
    await axiosInstance.get(`transactions/` + transactionId).then((res) => {
      //console.log(res.data);
      setTransactionData(res.data);
      if (auth.eori_nr == res.data.importeur) {
        setIsImporteur(true);
      }
    });
    console.log(transactionData);
    await axiosInstance
      .get(`documents/?transaction=` + transactionId)
      .then((res) => {
        //console.log(res.data);
        setDocumentsData(res.data);
      });

    await axiosInstance
      .get(`declaration_auth/?transaction=` + transactionId)
      .then((res) => {
        console.log(res.data.length);
        if (res.data[0]) {
          axiosInstance
            .get("invoice/" + res.data[0].invoice.id + "/")
            .then((resInvoice) => {
              setTotalValue(resInvoice.data.total_value);
              //console.log(res.data.total_value)
              setInvoiceData(resInvoice.data);
              setIsInvoice(true);
            })
            .catch((err) => {
              console.log("Keine Rechnung vorhanden");
              setIsInvoice(false);
            });
        } else {
          setIsInvoice(false);
        }
        if (res.data.length > 0) {
          console.log("Zollanmeldung liegt vor");
          setIsDeclaration(true);
          setDeclarationData(res.data[0]);
        }
      });

    setIsLoading(false);
  }, [newDocument]);
  // Wenn neues Dokument hinzugefügt wird GET-Request erneut ausgeführt

  // Summiert Anzahl von Dokumenten,
  // immer wenn sich documentsData verändert
  useEffect(() => {
    let invoices = 0;
    let other = 0;
    for (let i = 0; i < documentsData.length; i++) {
      if (documentsData[i].type == "Rechnung") {
        invoices += 1;
      } else {
        other += 1;
      }
    }
    setNumberInvoiceDocuments(invoices);
    setNumberOtherDocuments(other);
  }, [documentsData]);

  // -- Snackbar-Alert Rückmeldung --
  // State: Geöffnet (true) / Geschlossen (false)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // State: Succcess (true) / Error (false)
  const [snackbarSuccess, setSnackbarSuccess] = useState(true);
  // State: Snackbar Nachricht
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Öffnen der Snackbar
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  // Schließen der Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="loadingSpinner">
          <MDBSpinner>
            <span className="visually-hidden">Lädt..</span>
          </MDBSpinner>
        </div>
      ) : (
        <>
          <MDBContainer>
            <h3>Dokumente</h3>
            {/* Dokumenten Modal */}
            {isImporteur == true ? (
              <ImporteurDocumentsModal
                // Modal
                addDocumentModal={addDocumentModal}
                setAddDocumentModal={setAddDocumentModal}
                toggleAddDocumentModal={toggleAddDocumentModal}
                transactionData={transactionData}
                // Update State bei neuem Dokument
                newDocument={newDocument}
                setNewDocument={setNewDocument}
                // Snackbar
                handleOpenSnackbar={handleOpenSnackbar}
                handleCloseSnackbar={handleCloseSnackbar}
                setSnackbarSuccess={setSnackbarSuccess}
                setSnackbarMessage={setSnackbarMessage}
              />
            ) : (
              <DocumentsModal
                // Modal
                addDocumentModal={addDocumentModal}
                setAddDocumentModal={setAddDocumentModal}
                toggleAddDocumentModal={toggleAddDocumentModal}
                transactionData={transactionData}
                // Update State bei neuem Dokument
                newDocument={newDocument}
                setNewDocument={setNewDocument}
                // Snackbar
                handleOpenSnackbar={handleOpenSnackbar}
                handleCloseSnackbar={handleCloseSnackbar}
                setSnackbarSuccess={setSnackbarSuccess}
                setSnackbarMessage={setSnackbarMessage}
              />
            )}
            <DocumentBreadcrump
              key={transactionId}
              transactionId={transactionId}
            />
            <DocumentTransaction
              description={transactionData.description}
              dateAdded={transactionData.date_added}
              dateProcessed={transactionData.date_processed}
              status={transactionData.status}
              street={transactionData.partnership.partner.street}
              cityCode={transactionData.partnership.partner.city_code}
              countryCode={transactionData.partnership.partner.country_code}
              city={transactionData.partnership.partner.city}
              name={transactionData.partnership.partner.name}
              id={transactionData.id}
              blockchain_rid={transactionData.blockchain_id}
              transactionData={transactionData}
              isImporteur={isImporteur}
              numberInvoiceDocuments={numberInvoiceDocuments}
              numberOtherDocuments={numberOtherDocuments}
              isDeclaration={isDeclaration}
            />
            {/* Navleiste mit Anzahl der Dokumente */}
            <nav className="my-3 navbar navbar-expand-lg navbar-light bg-light">
              <MDBContainer>
                <div>
                  {isDeclaration ? (
                    <>
                      <MDBBadge pill className="ms-3">
                        {1}
                      </MDBBadge>{" "}
                      <b>Zollanmeldung</b>
                    </>
                  ) : (
                    <>
                      <MDBBadge pill className="ms-3">
                        {0}
                      </MDBBadge>{" "}
                      <b>Zollanmeldung</b>
                    </>
                  )}
                  <MDBBadge pill className="ms-3">
                    {numberInvoiceDocuments}
                  </MDBBadge>{" "}
                  <b>Rechnungsdokumente</b>
                  <MDBBadge pill className="ms-3">
                    {numberOtherDocuments}
                  </MDBBadge>{" "}
                  <b>Sonstige Dokumente</b>
                </div>
                <MDBBtn
                  className="float-end"
                  color="success"
                  onClick={toggleAddDocumentModal}
                >
                  <MDBIcon size="lg" className="me-2" fas icon="plus" />
                  Dokument hinzufügen
                </MDBBtn>
              </MDBContainer>
            </nav>
            {/* Auflistung der Rechnungsdokumente */}
            {isDeclaration && (
              <>
                <Divider textAlign="left" className="mb-4">
                  <h5>Zollanmeldung</h5>
                </Divider>
                <DeclarationCard
                  anmeldeArt={declarationData.anmeldeArt}
                  gesamtbetrag={totalValue}
                  bearbeitendeDienststelle={declarationData.customs_office.name}
                  lieferkosten={declarationData.invoice.transport_costs}
                  documentId={documentsData.documentId}
                  anmelderName={declarationData.importeur.name}
                  issue_date={declarationData.date_added}
                />
              </>
            )}

            {/* Auflistung der Rechnungsdokumente */}
            {numberInvoiceDocuments !== 0 && (
              <>
                <Divider textAlign="left" className="mt-5 mb-4">
                  {numberInvoiceDocuments == 1 ? (
                    <h5>Rechnungsdokument</h5>
                  ) : (
                    <h5>Rechnungsdokumente</h5>
                  )}
                </Divider>{" "}
                <MDBRow>
                  {documentsData.map(
                    (documentData) =>
                      documentData.type == "Rechnung" && (
                        <React.Fragment>
                          <MDBCol className="mb-4 d-flex justify-content-center">
                            <DocumentCard
                              key={documentData.id}
                              id={documentData.id}
                              author_company={
                                documentData.owner.employee.company.name
                              }
                              author={documentData.owner.username}
                              type={documentData.type}
                              description={documentData.description}
                              documentDate={documentData.issue_date}
                              uploadDate={documentData.upload_date}
                              blockchain_did={documentData.blockchain_did}
                              file={documentData.file}
                              confirmed={documentData.confirmed}
                            />
                          </MDBCol>
                        </React.Fragment>
                      )
                  )}
                </MDBRow>
              </>
            )}

            {/* Auflistung der sonstigen Dokumente */}
            {numberOtherDocuments !== 0 && (
              <>
                <Divider textAlign="left" className="mt-5 mb-4">
                  <h5>Sonstige Dokumente</h5>
                </Divider>
                <MDBRow>
                  {documentsData.map(
                    (documentData) =>
                      documentData.type !== "Rechnung" && (
                        <React.Fragment>
                          <MDBCol className="mb-4 d-flex justify-content-center">
                            <DocumentCard
                              key={documentData.id}
                              id={documentData.id}
                              author={documentData.author}
                              type={documentData.type}
                              description={documentData.description}
                              documentDate={documentData.issue_date}
                              uploadDate={documentData.upload_date}
                              file={documentData.file}
                              confirmed={documentData.confirmed}
                              blockchain_did={documentData.blockchain_id}
                            />
                          </MDBCol>
                        </React.Fragment>
                      )
                  )}
                </MDBRow>
              </>
            )}

            {/* Fals 0 Dokumente vorliegen */}
            {isDeclaration == false &&
            numberInvoiceDocuments == 0 &&
            numberOtherDocuments == 0 ? (
              <div
                className="d-flex align-items-center justify-content-center "
                style={{
                  height: "400px",
                }}
              >
                <h4
                  style={{
                    color: "grey",
                  }}
                >
                  Es liegen noch keine Dokumente vor.
                </h4>
              </div>
            ) : null}
          </MDBContainer>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            className="mt-5"
          >
            {snackbarSuccess == true ? (
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            ) : (
              <Alert
                onClose={handleCloseSnackbar}
                severity="error"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            )}
          </Snackbar>
        </>
      )}
    </>
  );
}

export default DocumentsNew;
