import React from "react";
import { Link } from "react-router-dom";
import { MDBBreadcrumb, MDBBreadcrumbItem } from "mdb-react-ui-kit";

function DocumentBreadcrump(props) {
  return (
    <>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>
          <Link to="/transactions">Aufträge</Link>
        </MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>
          Auftrags-ID {props.transactionId}
        </MDBBreadcrumbItem>
      </MDBBreadcrumb>
    </>
  );
}

export default DocumentBreadcrump;
