import React from "react";
import { Link } from "react-router-dom";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCol,
  MDBRow,
  MDBIcon,
} from "mdb-react-ui-kit";

function DeclarationCard(props) {
  return (
    <>
      <MDBCard>
        <MDBCardBody>
          <MDBRow>
            <MDBCol className="d-flex justify-content-center" sm="2">
              <MDBIcon fas icon="file-contract" size="4x" className="mt-4" />
            </MDBCol>
            <MDBCol sm="9">
              <b>Art der Anmeldung</b>: {props.anmeldeArt}
              <br />
              <b>Bearbeitende Dienststelle</b>: {props.bearbeitendeDienststelle}
              <br />
              <b>Gesamtbetrag</b>: {Number(props.gesamtbetrag).toFixed(2)}{" "}
              {props.waehrung}
              <br />
              <b>Lieferkosten</b>: {Number(props.lieferkosten).toFixed(2)}{" "}
              {props.waehrung}
              <br />
              <br />
              <b>Zollbetrag </b>(Pauschaler 4 % Zollsatz):{" "}
              {Number((props.gesamtbetrag + props.lieferkosten) * 0.04).toFixed(
                2
              )}{" "}
              {props.waehrung}
              <br />
              <b>EUSt-Betrag </b>(EUSt-Satz 19 %):{" "}
              {Number((props.gesamtbetrag + props.lieferkosten) * 0.19).toFixed(
                2
              )}{" "}
              {props.waehrung}
              <br />
              <b>Prognostizierte Gesamtabgabe</b>:{" "}
              {Number((props.gesamtbetrag + props.lieferkosten) * 0.25).toFixed(
                2
              )}{" "}
              {props.waehrung}
            </MDBCol>
            <MDBCol sm="1">
              <Link
                style={{ display: "block", margin: "1rem 0" }}
                to={"declarationView"}
                key={props.id}
                params={{ title: "Hello" }}
              >
                <MDBBtn outline className="float-end" color="primary">
                  Anzeigen
                </MDBBtn>
              </Link>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
        <MDBCardFooter>
          Erstellt am {props.issue_date} von {props.anmelderName}{" "}
        </MDBCardFooter>
      </MDBCard>
    </>
  );
}

export default DeclarationCard;
