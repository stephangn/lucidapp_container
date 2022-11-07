import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

// PDF-Reader
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const url =
  "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf";

export default function PreviewOther(props) {
  // -- DATENFELDER --

  // Auftrag Metadaten
  const [documentMetadata, setDocumentMetadata] = React.useState({
    documentId: props.documentData.id,
    transactionId: props.documentData.transaction,
    documentType: props.documentData.type,
    dateAdded: props.documentData.upload_date,
    description: props.documentData.description,
  });

  const [isZoll, setIsZoll] = useState(false);
  const { auth } = useAuth();
  const { transactionId, declarationID } = useParams();

  //Prüfen ob Betrachter Zoll ist
  useEffect(() => {
    if (auth.role == "custom_officer") {
      setIsZoll(true);
    }
  }, [auth.role]);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageNext() {
    changePage(+1);
  }

  return (
    <>
      <h3>Dokument: Sonstige</h3>
      {isZoll ? (
        <MDBBreadcrumb>
          <MDBBreadcrumbItem>
            <Link to="/zoll/declarations/">Zollanmeldungen</Link>
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem>
            <Link to={"/zoll/declarations/" + declarationID}>
              Zollanmeldungs-ID {declarationID}
            </Link>
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem active>
            Dokumenten-ID {documentMetadata.documentId}
          </MDBBreadcrumbItem>
        </MDBBreadcrumb>
      ) : (
        <MDBBreadcrumb>
          <MDBBreadcrumbItem>
            <Link to="/transactions">Aufträge</Link>
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem>
            <Link to={"/transactions/" + documentMetadata.transactionId}>
              Auftrags-ID {documentMetadata.transactionId}
            </Link>
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem active>
            Dokumenten-ID {documentMetadata.documentId}
          </MDBBreadcrumbItem>
        </MDBBreadcrumb>
      )}
      <MDBCard style={{ minHeight: "1000px" }}>
        <MDBCardHeader>
          <h5>
            {documentMetadata.documentType} für Auftrags-ID{" "}
            {documentMetadata.transactionId}
          </h5>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBRow>
            <MDBCol className="col-md-8">
              <div
                className="d-flex justify-content-center"
                style={{ minHeight: "800px" }}
              >
                <Document
                  // PDF muss Objekt sein
                  file={{
                    url: props.fileLink,
                  }}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
              </div>
              <div className="d-flex justify-content-center">
                <p>
                  Seite {pageNumber} von {numPages}
                </p>
              </div>
              {pageNumber > 1 ? (
                <MDBBtn
                  outline
                  className="float-start me-3"
                  onClick={changePageBack}
                >
                  <MDBIcon className="me-1" size="lg" fas icon="chevron-left" />
                  Letzte Seite
                </MDBBtn>
              ) : (
                <MDBBtn
                  outline
                  className="float-start me-3"
                  disabled
                  onClick={changePageBack}
                >
                  <MDBIcon className="me-1" size="lg" fas icon="chevron-left" />
                  Letzte Seite
                </MDBBtn>
              )}
              {pageNumber < numPages ? (
                <MDBBtn outline className="float-end" onClick={changePageNext}>
                  Nächste Seite
                  <MDBIcon
                    className="ms-1"
                    size="lg"
                    fas
                    icon="chevron-right"
                  />
                </MDBBtn>
              ) : (
                <MDBBtn
                  outline
                  className="float-end"
                  disabled
                  onClick={changePageNext}
                >
                  Nächste Seite
                  <MDBIcon
                    className="ms-1"
                    size="lg"
                    fas
                    icon="chevron-right"
                  />
                </MDBBtn>
              )}
            </MDBCol>
            <MDBCol
              className="col-md-4"
              style={{ border: "3px solid #cccccc", height: 500 }}
            >
              <p className="mt-4 ms-3">
                <b>Auftrags-ID: </b>
                {documentMetadata.transactionId}
              </p>
              <p className="ms-3">
                <b>Dokumenten-ID: </b>
                {documentMetadata.documentId}
              </p>
              <p className="ms-3">
                <b>Dokumententyp: </b>
                {documentMetadata.documentType}
              </p>
              <p className="ms-3">
                <b>Hochgeladen am: </b>
                {documentMetadata.dateAdded}
              </p>

              <p className="ms-3 mb-5">
                <b>Beschreibung: </b>
                {documentMetadata.description == "" ? (
                  <i>Es liegt keine Beschreibung vor.</i>
                ) : (
                  documentMetadata.description
                )}
              </p>

              <MDBBtn download href={props.fileLink} className="ms-3 mt-2">
                <MDBIcon fas icon="download" size="lg" className="me-1" />
                Download
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}
