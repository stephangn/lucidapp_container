import React, { useEffect } from "react";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { Box } from "@mui/system";
import { Button } from "@mui/material";

function AllgemeineAngaben(props) {
  // Check Status der Validierung bei Eingabe
  useEffect(() => {
    var forms = document.getElementById("allgemeineAngabenForm");

    if (forms.checkValidity() == true) {
      props.setAllgemeineAngabenValidity(true);
    }
  }, [props.fieldValue]);

  return (
    <>
      <h5 className="mb-4">Allgemeine Angaben</h5>
      <form id="allgemeineAngabenForm" onSubmit={(e) => e.preventDefault()}>
        <MDBRow>
          <MDBCol className="col-md-4">
            <TextField
              className="mb-3"
              // Für automatische Übernahme aus DB:
              disabled
              value={props.fieldValue.auftragsnummer}
              sx={{ minWidth: 300, maxWidth: 600 }}
              id="auftragsnummer"
              name="auftragsnummer"
              label="Auftragsnummer*"
              variant="outlined"
              error={
                props.inputMissingError.auftragsnummer ||
                props.inputWrongError.auftragsnummer
              }
              helperText={
                props.inputMissingError.auftragsnummer
                  ? "Pflichtfeld"
                  : props.inputWrongError.auftragsnummer
                  ? "Zahl eingeben"
                  : null
              }
              onChange={(event) => props.handleNumberFieldChange(event)}
            />
          </MDBCol>
          <MDBCol>
            <Autocomplete
              className="mb-3"
              disablePortal
              id="combo-box-customOffices"
              options={props.customOffices}
              //choose name as label for ui
              getOptionLabel={(option) => option.name}
              //when changed, save choosen Partner
              onChange={(event, value) => {
                props.setFieldValue((prev) => {
                  return {
                    ...prev,
                    bearbeitendeDienststelle: value?.id,
                  };
                });
                props.setPubkeyCO(value?.publickey);
              }}
              sx={{ width: 320 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Bearbeitende Dienststelle"
                />
              )}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-3">
          <MDBCol>
            <FormControl>
              <InputLabel id="anmeldungArt">Art der Anmeldung *</InputLabel>
              <Select
                sx={{ minWidth: 600, maxWidth: 900 }}
                name="anmeldungArt"
                labelId="anmeldungArt"
                id="anmeldungArt"
                value={props.fieldValue.anmeldungArt}
                label="Select"
                error={props.inputMissingError.anmeldungArt}
                required
                onChange={(event) => props.handleFieldChange(event)}
              >
                <MenuItem value="">
                  <em>Nichts</em>
                </MenuItem>
                <MenuItem value={"CO"}>
                  CO: Warenverkehr zwischen Mitgliedsstaaten der Gemeinschaft
                </MenuItem>
                <MenuItem value={"EU"}>
                  EU: Warenverkehr zwischen der Gemeinschaft und den
                  EFTA-/Visegrad-Ländern
                </MenuItem>
                <MenuItem value={"IM"}>
                  IM: Warenverkehr zwischen der Gemeinschaft und anderen
                  Drittländern als den EFTA-Ländern
                </MenuItem>
              </Select>
              {props.inputMissingError.anmeldeart ? (
                <FormHelperText error={true}>Pflichtfeld</FormHelperText>
              ) : null}
            </FormControl>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-3">
          <MDBCol>
            <FormControl>
              <InputLabel id="geschaeftArt">Art des Geschäfts *</InputLabel>
              <Select
                sx={{ minWidth: 600, maxWidth: 900 }}
                name="geschaeftArt"
                labelId="geschaeftArt"
                id="geschaeftArt"
                value={props.fieldValue.geschaeftArt}
                label="Select"
                error={props.inputMissingError.geschaeftArt}
                required
                onChange={(event) => props.handleFieldChange(event)}
              >
                <MenuItem value="">
                  <em>Nichts</em>
                </MenuItem>
                <MenuItem value={"Endgültiger Kauf/Verkauf"}>
                  Endgültiger Kauf/Verkauf (gewerblich)
                </MenuItem>
                <MenuItem value={"Direkter Handel mit privaten Verbrauchern"}>
                  Direkter Handel (mit privaten Verbrauchern)
                </MenuItem>
                <MenuItem value={"Rücksendung von Waren"}>
                  Rücksendung von Waren
                </MenuItem>
                <MenuItem value={"Ersatz (z. B. wegen Garantie)"}>
                  Ersatz (z. B. wegen Garantie)
                </MenuItem>
                <MenuItem value={"Finanzierungsleasing (Mietkauf)"}>
                  Finanzierungsleasing (Mietkauf)
                </MenuItem>
                <MenuItem value={"Warensendung zur Reperatur"}>
                  Warensendung zur Reperatur
                </MenuItem>
                <MenuItem value={"Anderweitige Geschäfte"}>
                  Anderweitige Geschäfte
                </MenuItem>
              </Select>
              {props.inputMissingError.geschaeftArt ? (
                <FormHelperText error={true}>Pflichtfeld</FormHelperText>
              ) : null}
            </FormControl>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <FormControl>
              <InputLabel id="zahlungArt">Zahlungsart (optional)</InputLabel>
              <Select
                sx={{ minWidth: 600, maxWidth: 900 }}
                name="zahlungArt"
                labelId="zahlungArt"
                id="zahlungArt"
                value={props.fieldValue.zahlungArt}
                label="Select"
                error={props.inputMissingError.zahlungArt}
                onChange={(event) => props.handleFieldChange(event)}
              >
                <MenuItem value="">
                  <em>Nichts</em>
                </MenuItem>
                <MenuItem value={"Barzahlung"}>Barzahlung</MenuItem>
                <MenuItem value={"Scheck"}>Scheck</MenuItem>
                <MenuItem value={"Überweisung"}>Überweisung</MenuItem>
                <MenuItem value={"Zahlungsaufschub"}>Zahlungsaufschub</MenuItem>
              </Select>
            </FormControl>
          </MDBCol>
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

export default AllgemeineAngaben;
