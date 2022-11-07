import React, { useState, useEffect } from "react";
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
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import MuiAlert from "@mui/material/Alert";

function DocumentTransaction(props) {
  const axiosInstance = useAxiosPrivate();

  const [declarationData, setDeclarationData] = useState();

  // State: Zollanmeldung vorhanden
  const [declarationExists, setDeclarationExists] = useState(false);
  // State: Status Zollanmeldung
  const [confirmation, setConfirmation] = useState("ausstehend");

  // Zollanmeldungen abrufen
  useEffect(() => {
    axiosInstance.get("declaration/").then((res) => {
      setDeclarationData(res.data);
      let declaration = res.data;
      let anmeldungVorhanden = false;

      if (declaration.length !== 0) {
        for (let i in declaration) {
          if (declaration[i].transaction == props.id) {
            // Wenn Anmeldung Transaktion angehört setze auf true
            setDeclarationExists(true);
            // Status Zollanmeldung abfragen
            setConfirmation(declaration[i].status_confirmation);
          }
        }
      }
    });
  }, []);

  return (
    <div>
      <MDBCard>
        <MDBCardBody>
          <MDBContainer>
            <MDBRow>
              <MDBCol>
                <MDBCardTitle>
                  {props.isImporteur ? "Import: " : "Export: "}
                  {props.description}
                </MDBCardTitle>
              </MDBCol>
            </MDBRow>

            <br />
          </MDBContainer>
          <MDBContainer>
            <MDBRow>
              <MDBCol>
                <MDBCardText>
                  <b>
                    Handelspartner{" "}
                    {props.isImporteur ? "(Exporteur)" : "(Importeur)"}
                  </b>
                  <br />
                  {props.name}
                  <br />
                  {props.street}
                  <br />
                  {props.cityCode} {props.city}, {props.countryCode}
                </MDBCardText>
              </MDBCol>
              <MDBCol>
                <MDBCardText>
                  <b>Dokumente insgesamt: </b>
                  {props.numberInvoiceDocuments + props.numberOtherDocuments}
                  <br />
                  <b>Rechnungsdokumente: </b>
                  {props.numberInvoiceDocuments}
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
              <MDBCol md="8" lg="9">
                {props.numberInvoiceDocuments == 0 ? (
                  <MuiAlert severity="info" sx={{ my: 1 }}>
                    Transaktion angelegt. Rechnung hochladen um Zollanmeldung
                    durchführen zu können.
                  </MuiAlert>
                ) : props.numberInvoiceDocuments !== 0 &&
                  declarationExists == false ? (
                  <MuiAlert severity="warning" sx={{ my: 1 }}>
                    Rechnung liegt vor. Zollanmeldung ausführen.
                  </MuiAlert>
                ) : declarationExists == true &&
                  confirmation == "ausstehend" ? (
                  <MuiAlert severity="info" sx={{ my: 1 }}>
                    Zollanmeldung abgeschickt. Warte auf Zollbescheid.
                  </MuiAlert>
                ) : confirmation == "bestätigt" ? (
                  <MuiAlert severity="success" sx={{ my: 1 }}>
                    Zollanmeldung angenommen.
                  </MuiAlert>
                ) : confirmation == "abgelehnt" ? (
                  <MuiAlert severity="error" sx={{ my: 1 }}>
                    Zollanmeldung angenommen.
                  </MuiAlert>
                ) : null}
              </MDBCol>
              <MDBCol md="4" lg="3">
                {props.isImporteur == true ? (
                  <div className="float-end">
                    {declarationExists == true ||
                    props.numberInvoiceDocuments == 0 ? (
                      <MDBBtn
                        style={{ display: "block", margin: "1rem 0" }}
                        disabled
                        className=""
                      >
                        Zollanmeldung
                      </MDBBtn>
                    ) : (
                      <Link
                        style={{ display: "block", margin: "1rem 0" }}
                        to={`declaration`}
                        params={{ title: "Hello" }}
                      >
                        <MDBBtn className="">Zollanmeldung</MDBBtn>
                      </Link>
                    )}
                  </div>
                ) : null}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBCardFooter>
            <MDBRow>
              <MDBCol md="4">Hinzugefügt: {props.dateAdded}</MDBCol>
              <MDBCol md="4">
                Zuletzt aktualisiert: {props.dateProcessed}
              </MDBCol>
            </MDBRow>
          </MDBCardFooter>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default DocumentTransaction;
