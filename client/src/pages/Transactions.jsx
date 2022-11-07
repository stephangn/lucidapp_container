import React, { useState, useEffect } from "react";
import "./css/LoadingSpinner.css";
import { MDBContainer, MDBCol, MDBRow, MDBSpinner } from "mdb-react-ui-kit";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Transaction from "../components/Transactions/Transaction";
import { useParams } from "react-router-dom";
import TransactionModal from "../components/Transactions/TransactionModal";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

// Snackbar-Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Transactions() {
  const [transactionsData, setTransactionsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [declarationData, setDeclarationData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  // Reload-State: DB-Call wird mittels useEffect wiederholt, sobald
  // ein neuer Auftrag hinzugefügt wurde
  const [reload, setreload] = useState(false);

  // State für Ladeanimation
  const [isLoading, setIsLoading] = useState(true);

  const axiosInstance = useAxiosPrivate();
  const [isFilterView, setIsFilterView] = useState(false);
  const [partnership, setPartnership] = useState();

  const { partnershipID } = useParams();
  let location = useLocation();

  // DB Call
  useEffect(async () => {
    var link;
    if (partnershipID) {
      link = "transactions/?partnership=" + partnershipID;
      setIsFilterView(true);
      await axiosInstance
        .get("partnership/" + partnershipID + "/")
        .then((res) => {
          setPartnership(res.data);
        });
    } else {
      link = "transactions/";
      setIsFilterView(false);
    }
    axiosInstance.get(link).then((res) => {
      // Daten werden erst sortiert nach "dateUpdatedDesc"
      // und danach im State gespeichert
      const initialSort = []
        .concat(res.data)
        .sort((a, b) => (a.timestamp_added > b.timestamp_added ? -1 : 1));
      setTransactionsData(initialSort);
    });
    setIsLoading(false);
  }, [reload, location]);

  // Dokumente abrufen
  useEffect(() => {
    axiosInstance.get("documents/").then((res) => {
      setDocumentsData(res.data);
    });
  }, []);

  // Zollanmeldungen abrufen
  useEffect(() => {
    axiosInstance.get("declaration/").then((res) => {
      setDeclarationData(res.data);
    });
  }, []);

  // Sortieralgorithmen
  function sortDescriptionAsc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) =>
        a.description.toUpperCase() > b.description.toUpperCase() ? -1 : 1
      );

    setTransactionsData(myData);
  }

  function sortDescriptionDesc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) =>
        a.description.toUpperCase() > b.description.toUpperCase() ? 1 : -1
      );

    setTransactionsData(myData);
  }

  function sortDateAddedAsc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.timestamp_added > b.timestamp_added ? 1 : -1));

    setTransactionsData(myData);
  }

  function sortDateAddedDesc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.timestamp_added > b.timestamp_added ? -1 : 1));

    setTransactionsData(myData);
  }

  function sortDateUpdatedAsc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.timestamp_processed > b.timestamp_processed ? 1 : -1));

    setTransactionsData(myData);
  }

  function sortDateUpdatedDesc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.timestamp_processed > b.timestamp_processed ? -1 : 1));

    setTransactionsData(myData);
  }

  function sortTransactions(event) {
    if (event.target.value === "DescriptionAsc") {
      sortDescriptionAsc();
      return;
    }
    if (event.target.value === "DescriptionDesc") {
      sortDescriptionDesc();
      return;
    }
    if (event.target.value === "UpdatedAsc") {
      sortDateUpdatedAsc();
      return;
    }
    if (event.target.value === "UpdatedDesc") {
      sortDateUpdatedDesc();
      return;
    }
    if (event.target.value === "AddedAsc") {
      sortDateAddedAsc();
      return;
    }
    if (event.target.value === "AddedDesc") {
      sortDateAddedDesc();
      return;
    }
  }

  // Snackbar-Alert Rückmeldung
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
        <div>
          <MDBContainer>
            <h3>Aufträge</h3>
            {isFilterView && (
              <h4>Daten sind gefiltert {partnership?.partner?.name}</h4>
            )}

            <nav className="my-3 navbar navbar-expand-lg navbar-light bg-light">
              <MDBContainer>
                <div>
                  <MDBRow>
                    <MDBCol>
                      <Form.Select
                        style={{
                          width: 270,
                        }}
                        className="me-3"
                        onChange={(event) => sortTransactions(event)}
                      >
                        <option value={"UpdatedDesc"}>
                          Zuletzt geändert absteigend
                        </option>
                        <option value={"UpdatedAsc"}>
                          Zuletzt geändert aufsteigend
                        </option>
                        <option value={"DescriptionDesc"}>
                          Beschreibung absteigend
                        </option>
                        <option value={"DescriptionAsc"}>
                          Beschreibung aufsteigend
                        </option>
                        <option value={"AddedDesc"}>
                          Hinzugefügt am absteigend
                        </option>
                        <option value={"AddedAsc"}>
                          Hinzugefügt am aufsteigend
                        </option>
                      </Form.Select>{" "}
                    </MDBCol>
                    <MDBCol>
                      <div className="mt-2">
                        <b>{transactionsData.length} Aufträge</b>
                      </div>
                    </MDBCol>
                  </MDBRow>
                </div>
                <TransactionModal
                  setreload={setreload}
                  reload={reload}
                  handleOpenSnackbar={handleOpenSnackbar}
                  handleCloseSnackbar={handleCloseSnackbar}
                  setSnackbarSuccess={setSnackbarSuccess}
                  setSnackbarMessage={setSnackbarMessage}
                />
              </MDBContainer>
            </nav>
            {transactionsData.map((transactionData) => (
              <React.Fragment>
                <Transaction
                  key={transactionData.id}
                  id={transactionData.id}
                  title={transactionData.description}
                  added={transactionData.date_added}
                  exportAddress={transactionData.partnership.partner.name}
                  exportStreet={transactionData.partnership.partner.street}
                  exportCity={transactionData.partnership.partner.city}
                  exportCountry={
                    transactionData.partnership.partner.country_code
                  }
                  importAddress={transactionData.importAddress}
                  importStreet={transactionData.importStreet}
                  importCity={transactionData.importCity}
                  importCountry={transactionData.importCountry}
                  stakeholderCount={transactionData.stakeholderCount}
                  lastChange={transactionData.date_processed}
                  status={transactionData.status}
                  importeur={transactionData.importeur}
                  timestamp_added={transactionData.timestamp_added}
                  timestamp_processed={transactionData.timestamp_processed}
                  documentsData={documentsData}
                  declarationData={declarationData}
                />
                <br />
              </React.Fragment>
            ))}
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
        </div>
      )}
    </>
  );
}

export default Transactions;
