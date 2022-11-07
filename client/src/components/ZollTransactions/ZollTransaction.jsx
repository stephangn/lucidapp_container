import React from "react";
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
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

function ZollTransaction(props) {
  return (
    <div>
      <MDBCard>
        <MDBCardBody>
          <MDBContainer>
            <MDBCardTitle>{props.title}</MDBCardTitle>

            <MDBCardSubTitle>Hinzugefügt am: {props.added}</MDBCardSubTitle>
            <br />
          </MDBContainer>
          <MDBContainer>
            <MDBRow>
              <MDBCol sm="2">
                <MDBIcon fas icon="file-contract" size="4x" className="mt-3" />
              </MDBCol>
              <MDBCol sm="5">
                <MDBCardText className="mb-3">
                  <b>Versender</b>
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
                  <b>Anmelder/Importeur</b>
                  <br />
                  {props.importName}
                  <br />
                  {props.importStreet}
                  <br />
                  {props.importCity}, {props.importCountry}
                </MDBCardText>
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="8" lg="8"></MDBCol>
              <MDBCol md="4" lg="4">
                <Link
                  style={{ display: "block" }}
                  to={"/zoll/declarations/" + props.id.toString()}
                  key={props.id}
                  params={{ title: "Hello" }}
                >
                  <MDBBtn className="float-end mb-2">Anmeldung anzeigen</MDBBtn>
                </Link>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBCardFooter>
            Zuletzt aktualisiert: {props.lastChange}
          </MDBCardFooter>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default ZollTransaction;
