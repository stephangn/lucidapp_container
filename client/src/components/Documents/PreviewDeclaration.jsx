import React, { useEffect, useState } from "react";
import "../../pages/css/LoadingSpinner.css";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBTabsPane,
  MDBTabsContent,
  MDBIcon,
  MDBSpinner,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosApi";
import useAuth from "../../hooks/useAuth";

export default function PreviewDelacration() {
  const { transactionId, declarationID } = useParams();
  const [customDeclaration, setCustomDeclaration] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [rechnungsposten, setRechnungsposten] = React.useState([]);
  const [fieldValue, setFieldValue] = React.useState({});
  const [invoiceData, setInvoiceData] = useState();

  const [auftragMetadaten, setAuftragMetadaten] = React.useState({});

  const [isZoll, setIsZoll] = useState(false);
  const { auth } = useAuth();

  //Prüfen ob Betrachter Zoll ist
  useEffect(() => {
    if (auth.role == "custom_officer") {
      setIsZoll(true);
    }
  }, [auth.role]);

  // DB Call
  useEffect(async () => {
    var link;
    if (transactionId == undefined) {
      link = "/declaration_auth/" + declarationID + "/";
    } else {
      link = "/declaration_auth/?transaction=" + transactionId;
    }
    await axiosInstance.get(link).then((res) => {
      if (res.data[0] != undefined) {
        res.data = res.data[0];
      }
      setCustomDeclaration(res.data);
      setRechnungsposten(res.data.invoice.invoiceItem);
      axiosInstance
        .get("/invoice/" + res.data.invoice.id + "/")
        .then((resI) => {
          setInvoiceData(resI.data);
        });
    });
    setIsLoading(false);
  }, []);

  //Werte im Timing richtig einspeichern und ggf. neu rendern wenn sie nicht vorliegen

  useEffect(async () => {
    await setFieldValue({
      auftragsnummer: customDeclaration?.transaction?.id,
      bearbeitendeDienststelle: customDeclaration?.customs_office?.name,
      anmeldungArt: customDeclaration?.anmeldeArt,
      geschaeftArt: customDeclaration?.geschaeftArt,
      zahlungArt: customDeclaration?.zahlungsart,
      // Adressdaten Versender
      eoriVersender: customDeclaration?.exporteur?.eori_nr,
      // nameVersender: "",
      // vornameVersender: "",
      firmaVersender: customDeclaration?.exporteur?.name,
      strasseVersender: customDeclaration?.exporteur?.street,
      plzVersender: customDeclaration?.exporteur?.city_code,
      ortVersender: customDeclaration?.exporteur?.city,
      staatVersender: customDeclaration?.exporteur?.country_code,
      telefonVersender: customDeclaration?.exporteur?.phone,
      emailVersender: customDeclaration?.exporteur?.email,
      // Adressdaten Anmelder
      eoriAnmelder: customDeclaration?.importeur?.eori_nr,
      // nameAnmelder: "",
      // vornameAnmelder: "",
      firmaAnmelder: customDeclaration?.importeur?.name,
      strasseAnmelder: customDeclaration?.importeur?.street,
      plzAnmelder: customDeclaration?.importeur?.city_code,
      ortAnmelder: customDeclaration?.importeur?.city,
      staatAnmelder: customDeclaration?.importeur?.country_code,
      telefonAnmelder: customDeclaration?.importeur?.phone,
      emailAnmelder: customDeclaration?.importeur?.email,
      // Lieferdaten
      ausfuhrland: customDeclaration?.ausfuhrland,
      bestimmungsland: customDeclaration?.bestimmungsland,
      //bestimmungsbundesland: "Niedersachsen",
      befoerderungsmittel: customDeclaration?.befoerderungsmittel,
      lieferbedingung: customDeclaration?.lieferbedingung,
      lieferort: customDeclaration?.lieferort,
      warenort: customDeclaration?.warenort,

      //Rechnungsdaten
      datumRechnung: customDeclaration?.invoice?.issue_date,
      gesamtbetrag: invoiceData?.total_value,
      waehrung: customDeclaration?.invoice?.currency,
      lieferkosten: customDeclaration?.invoice?.transport_costs,
    });
    setAuftragMetadaten({
      documentId: customDeclaration?.id,
      transactionId: customDeclaration?.transaction?.id,
      documentType: "Zollanmeldung",
      dateAdded: customDeclaration?.date_added,
      author: customDeclaration?.importeur?.name,
      freigabeStatus: true,
      description: "",
      statusAnmeldung: customDeclaration?.status,
      statusAuftrag: customDeclaration?.transaction?.status,
    });
  }, [customDeclaration, invoiceData]);

  // -- Tab-Steuerung --
  // State über aktiven Tab
  const [fillActive, setFillActive] = useState("tab1");

  // Funktion zum wechseln des Tabs
  function handleFillClick(value) {
    if (value === fillActive) {
      return;
    }

    setFillActive(value);
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
        <>
          <h3>Dokument: Zollanmeldung</h3>

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
              <MDBTabs pills className="card-header-tabs">
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab1")}
                    active={fillActive === "tab1"}
                  >
                    Allgemeine Angaben
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab2")}
                    active={fillActive === "tab2"}
                  >
                    Adressdaten
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab3")}
                    active={fillActive === "tab3"}
                  >
                    Lieferdaten
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab4")}
                    active={fillActive === "tab4"}
                  >
                    Rechnungsdaten
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow>
                <MDBCol className="col-md-8">
                  {fillActive === "tab1" ? (
                    <MDBCardTitle className="mb-4">
                      Allgemeine Angaben
                    </MDBCardTitle>
                  ) : fillActive === "tab2" ? (
                    <MDBCardTitle className="mb-4">Adressdaten</MDBCardTitle>
                  ) : fillActive === "tab3" ? (
                    <MDBCardTitle className="mb-4">Lieferdaten</MDBCardTitle>
                  ) : (
                    <MDBCardTitle className="mb-4">Rechnungsdaten</MDBCardTitle>
                  )}
                  <MDBCardText>
                    <MDBTabsContent>
                      <MDBTabsPane show={fillActive === "tab1"}>
                        <p>
                          <b>Auftragsnummer: </b>
                          {fieldValue.auftragsnummer}
                        </p>
                        <p>
                          <b>Bearbeitende Dienststelle: </b>
                          {fieldValue.bearbeitendeDienststelle}
                        </p>
                        <p>
                          <b>Art der Anmeldung: </b>
                          {fieldValue.anmeldungArt}
                        </p>
                        <p>
                          <b>Art des Geschäfts: </b>
                          {fieldValue.geschaeftArt}
                        </p>
                        <p>
                          <b>Zahlungsart: </b>
                          {fieldValue.zahlungArt}
                        </p>
                      </MDBTabsPane>
                      <MDBTabsPane show={fillActive === "tab2"}>
                        {/* Versender Daten */}
                        <h6>
                          <u>Versender</u>
                        </h6>
                        <p>
                          <b>EORI-Nummer: </b>
                          {fieldValue.eoriVersender}
                        </p>
                        <p>
                          <b>Firma: </b>
                          {fieldValue.firmaVersender}
                        </p>
                        <p>
                          <b>Straße u.Hausnummer: </b>
                          {fieldValue.strasseVersender}
                        </p>
                        <p>
                          <b>Postleitzahl: </b>
                          {fieldValue.plzVersender}
                        </p>
                        <p>
                          <b>Postleitzahl: </b>
                          {fieldValue.ortVersender}
                        </p>
                        <p>
                          <b>Staatsangehörigkeit: </b>
                          {fieldValue.staatVersender}
                        </p>
                        <p>
                          <b>Telefonnummer: </b>
                          {fieldValue.telefonVersender}
                        </p>
                        <p>
                          <b>Telefonnummer: </b>
                          {fieldValue.emailVersender}
                        </p>
                        <br />
                        {/* Anmelder Daten */}
                        <h6>
                          <u>Empfänger / Anmelder</u>
                        </h6>
                        <p>
                          <b>EORI-Nummer: </b>
                          {fieldValue.eoriAnmelder}
                        </p>
                        <p>
                          <b>Firma: </b>
                          {fieldValue.firmaAnmelder}
                        </p>
                        <p>
                          <b>Straße u.Hausnummer: </b>
                          {fieldValue.strasseAnmelder}
                        </p>
                        <p>
                          <b>Postleitzahl: </b>
                          {fieldValue.plzAnmelder}
                        </p>
                        <p>
                          <b>Postleitzahl: </b>
                          {fieldValue.ortAnmelder}
                        </p>
                        <p>
                          <b>Staatsangehörigkeit: </b>
                          {fieldValue.staatAnmelder}
                        </p>
                        <p>
                          <b>Telefonnummer: </b>
                          {fieldValue.telefonAnmelder}
                        </p>
                        <p>
                          <b>Telefonnummer: </b>
                          {fieldValue.emailAnmelder}
                        </p>
                      </MDBTabsPane>
                      <MDBTabsPane show={fillActive === "tab3"}>
                        <p>
                          <b>Ausfuhrland: </b>
                          {fieldValue.ausfuhrland}
                        </p>
                        <p>
                          <b>Bestimmungsland: </b>
                          {fieldValue.bestimmungsland}
                        </p>
                        <p>
                          <b>Bestimmungsbundesland: </b>
                          {fieldValue.bestimmungsbundesland}
                        </p>
                        <p>
                          <b>
                            Art des grenzüberschreitenden Beförderungsmittels:{" "}
                          </b>
                          {fieldValue.befoerderungsmittel}
                        </p>
                        <p>
                          <b>Lieferbedingungen: </b>
                          {fieldValue.lieferbedingung}
                        </p>
                        <p>
                          <b>Lieferort: </b>
                          {fieldValue.lieferort}
                        </p>
                        <p>
                          <b>Lieferort: </b>
                          {fieldValue.warenort}
                        </p>
                      </MDBTabsPane>
                      <MDBTabsPane show={fillActive === "tab4"}>
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
                        <hr className="my-4" />
                        {rechnungsposten.map((posten) => (
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
                        <hr className="my-4" />

                        {/* Berechnung Zollabgabe */}
                        <p className="ms-4">
                          <b>Zollwert</b> (Geamtbetrag + Lieferkosten) ={" "}
                          {(
                            Number(fieldValue.gesamtbetrag) +
                            Number(fieldValue.lieferkosten)
                          ).toFixed(2)}{" "}
                          {fieldValue.waehrung}
                        </p>
                        <p className="ms-4">
                          <b>Zollbetrag</b> (Pauschaler Zollsatz 4 %) ={" "}
                          {(
                            (Number(fieldValue.gesamtbetrag) +
                              Number(fieldValue.lieferkosten)) *
                            Number(0.04)
                          ).toFixed(2)}{" "}
                          {fieldValue.waehrung}
                        </p>
                        <p className="ms-4">
                          <b>Einfuhrumsatzsteuer(EUSt)-Wert</b> (Zollwert +
                          Zollbetrag) ={" "}
                          {(
                            (Number(fieldValue.gesamtbetrag) +
                              Number(fieldValue.lieferkosten)) *
                            Number(1.04)
                          ).toFixed(2)}{" "}
                          {fieldValue.waehrung}
                        </p>
                        <p className="ms-4">
                          <b>EUSt-Betrag</b> (EUSt-Wert * EUSt-Satz 19 %) ={" "}
                          {(
                            (Number(fieldValue.gesamtbetrag) +
                              Number(fieldValue.lieferkosten)) *
                            Number(1.04) *
                            Number(0.19)
                          ).toFixed(2)}{" "}
                          {fieldValue.waehrung}
                        </p>
                        <p className="ms-4">
                          <b>Prognostizierte Gesamtabgabe</b> (Zollbetrag +
                          EUSt-Betrag) ={" "}
                          <u>
                            {(
                              (Number(fieldValue.gesamtbetrag) +
                                Number(fieldValue.lieferkosten)) *
                                Number(0.04) +
                              (Number(fieldValue.gesamtbetrag) +
                                Number(fieldValue.lieferkosten)) *
                                Number(1.04) *
                                Number(0.19)
                            ).toFixed(2)}{" "}
                            {fieldValue.waehrung}
                          </u>
                        </p>
                      </MDBTabsPane>
                    </MDBTabsContent>
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

                  <p className="ms-3">
                    <b>Freigabe: </b>
                    {auftragMetadaten.freigabeStatus
                      ? "Für Zoll freigegeben"
                      : "Nicht für Zoll freigegeben"}
                  </p>
                  <p className="ms-3 mb-5">
                    <b>Status der Anmeldung: </b>
                    {auftragMetadaten.statusAnmeldung == "" ? (
                      <i>Es liegt keine Beschreibung vor.</i>
                    ) : (
                      auftragMetadaten.statusAnmeldung
                    )}
                  </p>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </>
      )}
    </>
  );
}
