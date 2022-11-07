import React from "react";
import "./css/LoadingSpinner.css";
import { MDBContainer, MDBCol, MDBRow, MDBSpinner } from "mdb-react-ui-kit";
import Partner from "../components/Partners/Partner";
import PartnersModal from "../components/Partners/PartnersModal";
import axiosInstance from "../axiosApi";
import PartnerRequests from "../components/Partners/PartnerRequests";

import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

// Snackbar-Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Partners() {
  const [partners, setPartners] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Für useEffect Aktualisierung bei neuem Partner
  const [newPartner, setNewPartner] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(async () => {
    const link = "/partnership/?is_archived=false&confirmed=true";
    await axiosInstance.get(link).then((res) => {
      //console.log(res.data);
      setPartners(res.data);
      setIsLoading(false);
    });
  }, [newPartner, reload]);

  // -- Snackbar-Alert Rückmeldung --
  // State: Geöffnet (true) / Geschlossen (false)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // State: Succcess (true) / Error (false)
  const [snackbarSuccess, setSnackbarSuccess] = useState(true);
  // State: Snackbar Nachricht
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //State für Reload

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

  // Sortier-Algorithmen

  function sortPartners(event) {
    if (event.target.value === "DescriptionAsc") {
      sortDescriptionAsc();
      return;
    }
    if (event.target.value === "DescriptionDesc") {
      sortDescriptionDesc();
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

  function sortDescriptionAsc() {
    const myData = []
      .concat(partners)
      .sort((a, b) =>
        a.partner.name.toUpperCase() > b.partner.name.toUpperCase() ? -1 : 1
      );
    setPartners(myData);
  }

  function sortDescriptionDesc() {
    const myData = []
      .concat(partners)
      .sort((a, b) =>
        a.partner.name.toUpperCase() > b.partner.name.toUpperCase() ? 1 : -1
      );
    setPartners(myData);
  }

  function sortDateAddedAsc() {
    const myData = []
      .concat(partners)
      .sort((a, b) => (a.timestamp_added > b.timestamp_added ? 1 : -1));
    setPartners(myData);
  }

  function sortDateAddedDesc() {
    const myData = []
      .concat(partners)
      .sort((a, b) => (a.timestamp_added > b.timestamp_added ? -1 : 1));
    setPartners(myData);
  }

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
            <MDBRow>
              <MDBCol>
                <h3>Handelsbeziehungen</h3>
              </MDBCol>
            </MDBRow>
            <br />
            <PartnerRequests
              setSnackbarSuccess={setSnackbarSuccess}
              setSnackbarMessage={setSnackbarMessage}
              handleOpenSnackbar={handleOpenSnackbar}
              handleCloseSnackbar={handleCloseSnackbar}
              setNewPartner={setNewPartner}
              newPartner={newPartner}
              reload={reload}
              setReload={setReload}
            />

            <nav className="my-3 navbar navbar-expand-lg navbar-light bg-light">
              <MDBContainer>
                <MDBRow>
                  <MDBCol>
                    <Form.Select
                      style={{
                        width: 270,
                      }}
                      className="me-3"
                      onChange={(event) => sortPartners(event)}
                    >
                      <option value={"AddedDesc"}>
                        Hinzugefügt am absteigend
                      </option>
                      <option value={"AddedAsc"}>
                        Hinzugefügt am aufsteigend
                      </option>
                      <option value={"DescriptionDesc"}>
                        Beschreibung absteigend
                      </option>
                      <option value={"DescriptionAsc"}>
                        Beschreibung aufsteigend
                      </option>
                    </Form.Select>{" "}
                  </MDBCol>
                  <MDBCol>
                    <div className="mt-2">
                      <b>{partners.length} Partner</b>
                    </div>
                  </MDBCol>
                </MDBRow>

                <PartnersModal
                  partnerships={partners}
                  handleOpenSnackbar={handleOpenSnackbar}
                  handleCloseSnackbar={handleCloseSnackbar}
                  setSnackbarSuccess={setSnackbarSuccess}
                  setSnackbarMessage={setSnackbarMessage}
                  newPartner={newPartner}
                  setNewPartner={setNewPartner}
                />
                {/* <TransactionModal setreload={setreload} reload={reload} /> */}
              </MDBContainer>
            </nav>
            {partners.map((partner) => (
              <React.Fragment>
                <Partner
                  key={partner.partner.eori_nr}
                  id={partner.partner.eori_nr}
                  id_relation={partner.id}
                  title={partner.partner.name}
                  added={partner.date_added}
                  addressName="Bedeutung des Feldes?"
                  addressStreet={partner.partner.street}
                  addressCity={partner.partner.city}
                  addressCountry={partner.partner.country_code}
                  email={partner.partner.email}
                  phone={partner.partner.phone}
                  eori={partner.partner.eori_nr}
                  // Snackbar States
                  setSnackbarSuccess={setSnackbarSuccess}
                  setSnackbarMessage={setSnackbarMessage}
                  handleOpenSnackbar={handleOpenSnackbar}
                  handleCloseSnackbar={handleCloseSnackbar}
                  // Reload States
                  reload={reload}
                  setReload={setReload}
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

export default Partners;
