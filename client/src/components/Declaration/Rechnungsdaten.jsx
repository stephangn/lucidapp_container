import React, { useEffect } from "react";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { Box } from "@mui/system";
import { Button } from "@mui/material";

function Rechnungsdaten(props) {
  // Check Status der Validierung bei Eingabe
  useEffect(() => {
    var forms = document.getElementById("rechnungsdatenForm");

    if (forms.checkValidity() == true) {
      props.setRechnungsdatenValidity(true);
    }
  }, [props.usedInvoice]);

  return (
    <>
      <h5 className="mb-4">Rechnungsdaten</h5>
      <form id="rechnungsdatenForm" onSubmit={(e) => e.preventDefault()}>
        <MDBRow>
          <MDBCol>
            <Autocomplete
              className="mb-3"
              disablePortal
              id="combo-box-transactioninvoices"
              options={props.transactionInvoices}
              //choose name as label for ui
              getOptionLabel={(option) => option.description}
              //when changed, save choosen Partner
              onChange={(event, value) => {
                props.setUsedInvoice(value.id);
              }}
              sx={{ width: 320 }}
              renderInput={(params) => (
                <TextField {...params} required label="Rechnungsdokument" />
              )}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <TextField
              className="mb-3"
              sx={{ minWidth: 250, maxWidth: 250 }}
              type="date"
              id="datumRechnung"
              name="datumRechnung"
              label="Rechnungsdatum*"
              variant="outlined"
              disabled
              value={props.fieldValue.datumRechnung}
              error={
                props.inputMissingError.datumRechnung ||
                props.inputWrongError.datumRechnung
              }
              helperText={
                props.inputMissingError.datumRechnung ? "Pflichtfeld" : null
              }
              onChange={(event) => props.handleFieldChange(event)}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <TextField
              sx={{ minWidth: 250, maxWidth: 250 }}
              className="mb-3 me-3"
              id="gesamtbetrag"
              name="gesamtbetrag"
              label="Gesamtbetrag*"
              variant="outlined"
              disabled
              value={props.fieldValue.gesamtbetrag}
              error={
                props.inputMissingError.gesamtbetrag ||
                props.inputWrongError.gesamtbetrag
              }
              helperText={
                props.inputMissingError.eoriVersender
                  ? "Pflichtfeld"
                  : props.inputWrongError.eoriVersender
                  ? "Zahl eingeben"
                  : null
              }
              onChange={(event) => props.handleNumberFieldChange(event)}
            />

            <TextField
              className="mb-3"
              id="waehrung"
              name="waehrung"
              label="Währung*"
              variant="outlined"
              disabled
              value={props.fieldValue.waehrung}
              error={
                props.inputMissingError.waehrung ||
                props.inputWrongError.waehrung
              }
              helperText={
                props.inputMissingError.waehrung ? "Pflichtfeld" : null
              }
              onChange={(event) => props.handleFieldChange(event)}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <TextField
              className="mb-3 me-3"
              sx={{ minWidth: 250, maxWidth: 250 }}
              id="lieferkosten"
              name="lieferkosten"
              label="Lieferkosten*"
              variant="outlined"
              disabled
              value={props.fieldValue.lieferkosten}
              error={
                props.inputMissingError.lieferkosten ||
                props.inputWrongError.lieferkosten
              }
              helperText={
                props.inputMissingError.lieferkosten ? "Pflichtfeld" : null
              }
              onChange={(event) => props.handleNumberFieldChange(event)}
            />
          </MDBCol>
        </MDBRow>
        <hr className="my-4" />
        {/* Rechnungsposten müssen gemapt werden: */}
        {props.rechnungsposten.map((posten) => (
          <>
            <MDBRow className="mb-3">
              <MDBCol>
                <b>Rechnungsposten:</b>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <TextField
                  sx={{ minWidth: 400, maxWidth: 400 }}
                  className="mb-3"
                  disabled
                  value={posten.product}
                  id="rechnungspostenProdukt"
                  name="rechnungspostenProdukt"
                  label="Produkt*"
                  variant="outlined"
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <TextField
                  sx={{ minWidth: 200, maxWidth: 200 }}
                  className="mb-3 me-3"
                  disabled
                  value={posten.amount}
                  id="rechnungspostenAnzahl"
                  name="rechnungspostenAnzahl"
                  label="Anzahl*"
                  variant="outlined"
                />
                <TextField
                  className="mb-3 me-3"
                  disabled
                  sx={{ minWidth: 200, maxWidth: 200 }}
                  value={posten.unit}
                  id="rechnungspostenEinheit"
                  name="rechnungspostenEinheit"
                  label="Einheit*"
                  variant="outlined"
                />
                <TextField
                  className="mb-3 me-3"
                  sx={{ minWidth: 200, maxWidth: 200 }}
                  value={posten.price}
                  disabled
                  id="rechnungspostenPreisEinheit"
                  name="rechnungspostenPreisEinheit"
                  label="Preis pro Einheit*"
                  variant="outlined"
                />
              </MDBCol>
            </MDBRow>
          </>
        ))}
        <hr className="my-4" />

        {/* Abgaben Berechnung: */}
        <MDBRow>
          <p className="ms-4">
            <b>Zollwert</b> (Geamtbetrag + Lieferkosten) ={" "}
            {(
              Number(props.fieldValue.gesamtbetrag) +
              Number(props.fieldValue.lieferkosten)
            ).toFixed(2)}{" "}
            {props.fieldValue.waehrung}
          </p>
          <p className="ms-4">
            <b>Zollbetrag</b> (Pauschaler Zollsatz 4 %) ={" "}
            {(
              (Number(props.fieldValue.gesamtbetrag) +
                Number(props.fieldValue.lieferkosten)) *
              Number(0.04)
            ).toFixed(2)}{" "}
            {props.fieldValue.waehrung}
          </p>
          <p className="ms-4">
            <b>Einfuhrumsatzsteuer(EUSt)-Wert</b> (Zollwert + Zollbetrag) ={" "}
            {(
              (Number(props.fieldValue.gesamtbetrag) +
                Number(props.fieldValue.lieferkosten)) *
              Number(1.04)
            ).toFixed(2)}{" "}
            {props.fieldValue.waehrung}
          </p>
          <p className="ms-4">
            <b>EUSt-Betrag</b> (EUSt-Wert * EUSt-Satz 19 %) ={" "}
            {(
              (Number(props.fieldValue.gesamtbetrag) +
                Number(props.fieldValue.lieferkosten)) *
              Number(1.04) *
              Number(0.19)
            ).toFixed(2)}{" "}
            {props.fieldValue.waehrung}
          </p>
          <p className="ms-4">
            <b>Prognostizierte Gesamtabgabe</b> (Zollbetrag + EUSt-Betrag) ={" "}
            <u>
              {(
                (Number(props.fieldValue.gesamtbetrag) +
                  Number(props.fieldValue.lieferkosten)) *
                  Number(0.04) +
                (Number(props.fieldValue.gesamtbetrag) +
                  Number(props.fieldValue.lieferkosten)) *
                  Number(1.04) *
                  Number(0.19)
              ).toFixed(2)}{" "}
              {props.fieldValue.waehrung}
            </u>
          </p>
        </MDBRow>
        {/* Stepper von Declaration */}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            sx={{ mr: 1 }}
          >
            Zurück
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {props.isStepOptional(props.activeStep) && (
            <Button color="inherit" onClick={props.handleSkip} sx={{ mr: 1 }}>
              Überspringen
            </Button>
          )}

          {props.activeStep === props.steps.length - 1 ? (
            <Button onClick={props.handleSubmit}>Abschicken</Button>
          ) : (
            <Button type="submit" onClick={props.handleNext}>
              Weiter
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}

export default Rechnungsdaten;
