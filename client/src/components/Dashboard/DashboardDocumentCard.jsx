import { React, useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn,
} from "mdb-react-ui-kit";

import { Link } from "react-router-dom";


function DashboardDocumentCard(props) {

  return (
    <>
      <MDBCard
        className="me-3 mb-2"
        style={{ minHeight: "300px", width: "300px" }}
      >
        <MDBCardHeader>Auftrags-ID {props.document.transaction}</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>{props.document.type} ({props.document.issue_date})</MDBCardTitle>
          <MDBCardText className="my-4">
            {props.document.description == "" ? <br /> : props.document.description}
          </MDBCardText>
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={"/transactions/" + props.document.transaction.toString() + "/document/" + props.document.id.toString()}
          >
            <MDBBtn outline>
              Anzeigen
            </MDBBtn>
          </Link>
        </MDBCardBody>
        <MDBCardFooter className="text-muted">
          Hochgeladen am: {props.document.upload_date}
          <br />
          von {props.document.owner.employee.company.name} ({props.document.owner.username})
        </MDBCardFooter>
      </MDBCard>
    </>
  );
}

export default DashboardDocumentCard;
