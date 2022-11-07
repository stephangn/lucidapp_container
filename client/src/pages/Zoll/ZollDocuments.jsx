import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import "../css/LoadingSpinner.css";
import {
  MDBContainer,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBSpinner,
  MDBBadge,
} from "mdb-react-ui-kit";
import { MDBBreadcrumb, MDBBreadcrumbItem } from "mdb-react-ui-kit";

import Divider from "@mui/material/Divider";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import ZollDocumentsModal from "../../components/ZollDocuments/ZollDocumentsModal";
import ZollDocumentTransaction from "../../components/ZollDocuments/ZollDocumentTransaction";
import DocumentCard from "../../components/Documents/DocumentCard";
import DeclarationCard from "../../components/Documents/DeclarationCard";

// Snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ZollDocuments(props) {
  // Allgemeine Auftragsinformationen
  const [transactionData, setTransactionData] = useState([]);

  // Informationen der hochgeladenen Dokumente
  const [documentsData, setDocumentsData] = useState([]);
  const [declarationData, setDeclarationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(true);
  const [invoiceData, setInvoiceData] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [open, setOpen] = useState(false);

  const [reload, setReload] = useState(false);

  const axiosInstance = useAxiosPrivate();

  // Speichern der Transaktions-ID aus URL
  const { declarationID } = useParams();

  useEffect(async () => {
    await axiosInstance
      .get(`declaration_auth/` + declarationID)
      .then((res) => {
        setDeclarationData(res.data);
        setDocumentsData(res.data.document);
        setTransactionData(res.data.transaction);
        axiosInstance
          .get("invoice/" + res.data.invoice.id + "/")
          .then((res) => {
            setTotalValue(res.data.total_value);

            setInvoiceData(res.data);
          });
      })
      .catch((err) => {
        console.log("Keine Zollanmeldung liegt vor" + err);
      });

    setIsLoading(false);
  }, [reload]);

  // State für "Dokument hinzufügen" Modal
  const [addDocumentModal, setAddDocumentModal] = useState(false);
  // Funktion für Manipulation von Modal (als props weitergereicht)
  function toggleAddDocumentModal() {
    setAddDocumentModal(!addDocumentModal);
  }

  // Anzahl Rechnungs+Zolldokumente call(a) und sonstige Dokumente call(b)
  function numberInvoiceDocuments(alternative) {
    let invoiceAndCustoms = 0;
    let other = 0;
    for (let i = 0; i < documentsData.length; i++) {
      if (documentsData[i].type == "Rechnung") {
        invoiceAndCustoms += 1;
      } else {
        other += 1;
      }
    }
    if (alternative == "a") {
      return invoiceAndCustoms;
    }
    if (alternative == "b") {
      return other;
    }
    return;
  }

  // -- Loading Backdrop --
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

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
        <MDBContainer>
          <h3>Zollanmeldung Dokumente</h3>
          <ZollDocumentsModal
            basicModal={addDocumentModal}
            setBasicModal={setAddDocumentModal}
            toggleShow={toggleAddDocumentModal}
            transactionData={transactionData}
            setSnackbarSuccess={setSnackbarSuccess}
            setSnackbarMessage={setSnackbarMessage}
            handleOpenSnackbar={handleOpenSnackbar}
            handleCloseSnackbar={handleCloseSnackbar}
            transactionID_zoll={declarationData.transaction.id}
            reload={reload}
            setReload={setReload}
          />
          <MDBBreadcrumb>
            <MDBBreadcrumbItem>
              <Link to="/zoll/declarations">Aufträge</Link>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem active>
              Zollanmeldung-ID {declarationData.id}
            </MDBBreadcrumbItem>
          </MDBBreadcrumb>
          <ZollDocumentTransaction
            declarationData={declarationData}
            numberDocuments={documentsData?.length}
            gesamtbetrag={totalValue}
            invoiceData={invoiceData}
            setIsVerified={setIsVerified}
            isVerified={isVerified}
            setOpen={setOpen}
            handleToggleBackdrop={handleToggleBackdrop}
            handleCloseBackdrop={handleCloseBackdrop}
            handleOpenSnackbar={handleOpenSnackbar}
            handleCloseSnackbar={handleCloseSnackbar}
            setSnackbarSuccess={setSnackbarSuccess}
            setSnackbarMessage={setSnackbarMessage}
            reload={reload}
            setReload={setReload}
          />

          {/* Navleiste mit Anzahl der Dokumente */}
          <nav className="my-3 navbar navbar-expand-lg navbar-light bg-light">
            <MDBContainer>
              <div>
                <MDBBadge pill className="ms-3">
                  {1}
                </MDBBadge>{" "}
                <b>Zollanmeldung</b>
                <MDBBadge pill className="ms-3">
                  {1}
                </MDBBadge>{" "}
                <b>Rechnungsdokument</b>
                <MDBBadge pill className="ms-3">
                  {numberInvoiceDocuments("b")}
                </MDBBadge>{" "}
                <b>Sonstige Dokumente</b>
              </div>
              <MDBBtn
                className="float-end"
                color="success"
                onClick={toggleAddDocumentModal}
              >
                Zollbescheid hochladen
              </MDBBtn>
            </MDBContainer>
          </nav>
          {/* Auflistung der Rechnungsdokumente */}
          <Divider textAlign="left" className="my-4">
            <h5>Zollanmeldung</h5>
          </Divider>
          <MDBRow>
            <DeclarationCard
              anmeldeArt={declarationData.anmeldeArt}
              gesamtbetrag={totalValue}
              waehrung={declarationData.invoice.currency}
              bearbeitendeDienststelle={declarationData.customs_office.name}
              lieferkosten={declarationData.invoice.transport_costs}
              documentId={documentsData.documentId}
              anmelderName={declarationData.importeur.name}
              issue_date={declarationData.date_added}
            />
          </MDBRow>
          <Divider textAlign="left" className="my-4">
            <h5>Rechnungsdokument</h5>
          </Divider>
          <MDBRow>
            <MDBCol className="mb-4 d-flex justify-content-center">
              <DocumentCard
                key={declarationData.invoice.id}
                id={declarationData.invoice.id}
                author_company={declarationData.exporteur.name}
                author="Karl Company"
                type="Rechnung"
                description={declarationData.invoice.description}
                documentDate={declarationData.invoice.issue_date}
                uploadDate={declarationData.invoice.upload_date}
                file={declarationData.invoice.file}
                isZoll={true}
              />
            </MDBCol>
          </MDBRow>

          {/* Auflistung der sonstigen Dokumente */}
          {numberInvoiceDocuments("b") !== 0 && (
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
                            isZoll={true}
                            blockchain_did={documentData.blockchain_id}
                          />
                        </MDBCol>
                      </React.Fragment>
                    )
                )}
              </MDBRow>
            </>
          )}

          {/* Loading Backddrop */}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openBackdrop}
            onClick={handleCloseBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {/* Snackbar */}
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
        </MDBContainer>
      )}
    </>
  );
}

export default ZollDocuments;
