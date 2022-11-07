import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardHeader,
  MDBRow,
  MDBCol,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

export default function PreviewInvoice(props) {
  const [isZoll, setIsZoll] = useState(false);
  const { auth } = useAuth();
  const { transactionId, declarationID } = useParams();

  useEffect(() => {
    if (auth.role == "custom_officer") {
      setIsZoll(true);
    }
  }, [auth.role]);
  // Auftrag Metadaten
  const [auftragMetadaten, setAuftragMetadaten] = React.useState({
    documentId: props.invoiceData.id,
    transactionId: props.invoiceData.transaction,
    documentType: "Rechnung",
    dateAdded: props.transactionData.upload_date,
    description: props.invoiceData.description,
  });

  // State des Inhalts der Felder
  const [fieldValue, setFieldValue] = React.useState({
    //Rechnungsdaten
    datumRechnung: props.invoiceData.issue_date,
    gesamtbetrag: props.invoiceData.total_value,
    waehrung: props.invoiceData.currency,
    lieferkosten: props.invoiceData.transport_costs,
    beschreibung: props.invoiceData.description,
  });
  //Durch dieses Array von Objekten mappen
  const Rechnungsposten = props.invoiceData.invoiceItem;

  return (
    <>
      <h3>Dokument: Rechnung</h3>
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
            Dokumenten-ID {auftragMetadaten.documentId}
          </MDBBreadcrumbItem>
        </MDBBreadcrumb>
      ) : (
        <MDBBreadcrumb>
          <MDBBreadcrumbItem>
            <Link to="/transactions">Aufträge</Link>
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem>
            <Link to={"/transactions/" + auftragMetadaten.transactionId}>
              Auftrags-ID {auftragMetadaten.transactionId}
            </Link>
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem active>
            Dokumenten-ID {auftragMetadaten.documentId}
          </MDBBreadcrumbItem>
        </MDBBreadcrumb>
      )}
      <MDBCard style={{ minHeight: 600 }}>
        <MDBCardHeader>
          <h5>Rechnung für Auftrags-ID {auftragMetadaten.transactionId}</h5>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBRow>
            <MDBCol className="col-md-8">
              <MDBCardText>
                <p>
                  <b>Rechnungsdatum: </b>
                  {fieldValue.datumRechnung}
                </p>
                <p>
                  <b>Gesamtbetrag: </b>
                  {fieldValue.gesamtbetrag} {fieldValue.waehrung}
                </p>
                <p>
                  <b>Lieferkosten: </b>
                  {fieldValue.lieferkosten} {fieldValue.waehrung}
                </p>

                {Rechnungsposten.map((posten) => (
                  <>
                    <hr className="my-4" />
                    <h6>
                      <u>Rechnungsposten 1</u>
                    </h6>
                    <p>
                      <b>Produkt: </b>
                      {posten.product}
                    </p>
                    <p>
                      <b>Anzahl: </b>
                      {posten.amount}
                    </p>
                    <p>
                      <b>Einheit: </b>
                      {posten.unit}
                    </p>
                    <p>
                      <b>Preis pro Einheit: </b>
                      {posten.price.toFixed(2)} {fieldValue.waehrung}
                    </p>
                  </>
                ))}
              </MDBCardText>
            </MDBCol>
            <MDBCol
              className="col-md-4"
              style={{ border: "3px solid #cccccc", height: 500 }}
            >
              <p className="mt-4 ms-3">
                <b>Auftrags-ID: </b>
                {auftragMetadaten.transactionId}
              </p>
              <p className="ms-3">
                <b>Dokumenten-ID: </b>
                {auftragMetadaten.documentId}
              </p>
              <p className="ms-3">
                <b>Dokumententyp: </b>
                {auftragMetadaten.documentType}
              </p>
              <p className="ms-3">
                <b>Hochgeladen am: </b>
                {auftragMetadaten.dateAdded}
              </p>
              <p className="ms-3">
                <b>Hochgeladen von: </b>
                {auftragMetadaten.author}
              </p>
              <p className="ms-3 mb-5">
                <b>Beschreibung: </b>
                {auftragMetadaten.description == "" ? (
                  <i>Es liegt keine Beschreibung vor.</i>
                ) : (
                  auftragMetadaten.description
                )}
              </p>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}
