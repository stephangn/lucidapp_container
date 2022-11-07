import React, { useEffect } from "react";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";

import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { Box } from "@mui/system";
import { Button } from "@mui/material";

function Lieferdaten(props) {
  // Check Status der Validierung bei Eingabe
  useEffect(() => {
    var forms = document.getElementById("lieferdatenForm");

    if (forms.checkValidity() == true) {
      props.setLieferdatenValidity(true);
    }
  }, [props.fieldValue]);

  return (
    <>
      <h5 className="mb-4">Lieferdaten</h5>
      <form id="lieferdatenForm" onSubmit={(e) => e.preventDefault()}>
        <MDBRow>
          <MDBCol>
            <TextField
              className="mb-3 me-3"
              sx={{ minWidth: 400, maxWidth: 600 }}
              id="ausfuhrland"
              name="ausfuhrland"
              label="Ausfuhrland"
              variant="outlined"
              error={
                props.inputMissingError.ausfuhrland ||
                props.inputWrongError.ausfuhrland
              }
              helperText={
                props.inputMissingError.ausfuhrland ? "Pflichtfeld" : null
              }
              type="text"
              required
              onChange={(event) => props.handleFieldChange(event)}
            />

            <TextField
              className="mb-3"
              sx={{ minWidth: 400, maxWidth: 600 }}
              id="bestimmungsland"
              name="bestimmungsland"
              label="Bestimmungsland"
              variant="outlined"
              error={
                props.inputMissingError.bestimmungsland ||
                props.inputWrongError.bestimmungsland
              }
              helperText={
                props.inputMissingError.bestimmungsland ? "Pflichtfeld" : null
              }
              type="text"
              required
              onChange={(event) => props.handleFieldChange(event)}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-3">
          <MDBCol>
            <FormControl>
              <InputLabel id="bestimmungsbundesland">
                Bestimmungsbundesland *
              </InputLabel>
              <Select
                sx={{ minWidth: 300, maxWidth: 900 }}
                name="bestimmungsbundesland"
                labelId="bestimmungsbundesland"
                id="bestimmungsbundesland"
                value={props.fieldValue.bestimmungsbundesland}
                label="Select"
                error={props.inputMissingError.bestimmungsbundesland}
                required
                onChange={(event) => props.handleFieldChange(event)}
              >
                <MenuItem value="">
                  <em>Nichts</em>
                </MenuItem>
                <MenuItem value={"Baden-Württemberg"}>
                  Baden-Württemberg
                </MenuItem>
                <MenuItem value={"Bayern"}>Bayern</MenuItem>
                <MenuItem value={"Berlin"}>Berlin</MenuItem>
                <MenuItem value={"Brandenburg"}>Brandenburg</MenuItem>
                <MenuItem value={"Bremen"}>Bremen</MenuItem>
                <MenuItem value={"Hamburg"}>Hamburg</MenuItem>
                <MenuItem value={"Hessen"}>Hessen</MenuItem>
                <MenuItem value={"Mecklenburg-Vorpommern"}>
                  Mecklenburg-Vorpommern
                </MenuItem>
                <MenuItem value={"Niedersachsen"}>Niedersachsen</MenuItem>
                <MenuItem value={"Nordrhein-Westfalen"}>
                  Nordrhein-Westfalen
                </MenuItem>
                <MenuItem value={"Rheinland-Pfalz"}>Rheinland-Pfalz</MenuItem>
                <MenuItem value={"Saarland"}>Saarland</MenuItem>
                <MenuItem value={"Sachsen"}>Sachsen</MenuItem>
                <MenuItem value={"Sachsen-Anhalt"}>Sachsen-Anhalt</MenuItem>
                <MenuItem value={"Schleswig-Holstein"}>
                  Schleswig-Holstein
                </MenuItem>
                <MenuItem value={"Thüringen"}>Thüringen</MenuItem>
                <MenuItem value={"Ausland"}>Für das Ausland bestimmt</MenuItem>
              </Select>
              {props.inputMissingError.bestimmungsbundesland ? (
                <FormHelperText error={true}>Pflichtfeld</FormHelperText>
              ) : null}
            </FormControl>
          </MDBCol>
        </MDBRow>
        <hr className="my-4" />
        <MDBRow className="mb-3">
          <MDBCol>
            <FormControl>
              <InputLabel id="befoerderungsmittel">
                Art des grenzüberschreitenden Beförderungsmittel *
              </InputLabel>
              <Select
                sx={{ minWidth: 500, maxWidth: 600 }}
                name="befoerderungsmittel"
                labelId="befoerderungsmittel"
                id="befoerderungsmittel"
                value={props.fieldValue.befoerderungsmittel}
                label="Select"
                error={props.inputMissingError.befoerderungsmittel}
                required
                onChange={(event) => props.handleFieldChange(event)}
              >
                <MenuItem value="">
                  <em>Nichts</em>
                </MenuItem>
                <MenuItem value={"Lastkraftwagen"}>Lastkraftwagen</MenuItem>
                <MenuItem value={"Schiff"}>Schiff</MenuItem>
                <MenuItem value={"Waggon"}>Waggon</MenuItem>
                <MenuItem value={"Flugzeug"}>Flugzeug</MenuItem>
                <MenuItem value={"PKW"}>PKW</MenuItem>
                <MenuItem value={"Ohne"}>Ohne</MenuItem>
                <MenuItem value={"Andere"}>Andere</MenuItem>
              </Select>
              {props.inputMissingError.befoerderungsmittel ? (
                <FormHelperText error={true}>Pflichtfeld</FormHelperText>
              ) : null}
            </FormControl>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-3">
          <MDBCol>
            <FormControl>
              <InputLabel id="lieferbedingung">Lieferbedingung *</InputLabel>
              <Select
                sx={{ minWidth: 600, maxWidth: 900 }}
                name="lieferbedingung"
                labelId="lieferbedingung"
                id="lieferbedingung"
                value={props.fieldValue.lieferbedingung}
                label="Select"
                error={props.inputMissingError.lieferbedingung}
                required
                onChange={(event) => props.handleFieldChange(event)}
              >
                <MenuItem value="">
                  <em>Nichts</em>
                </MenuItem>
                <MenuItem value={"CFR"}>Kosten und Fracht</MenuItem>
                <MenuItem value={"CIF"}>
                  Kosten, Versicherung und Fracht
                </MenuItem>
                <MenuItem value={"DAP"}>Geliefert benannter Ort</MenuItem>
                <MenuItem value={"DAT"}>Geliefert Terminal</MenuItem>
                <MenuItem value={"DDP"}>Geliefert verzollt</MenuItem>
                <MenuItem value={"FOB"}>Frei an Bord</MenuItem>
              </Select>
            </FormControl>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <TextField
              className="mb-3 me-3"
              sx={{ minWidth: 400, maxWidth: 600 }}
              id="lieferort"
              name="lieferort"
              label="Lieferort"
              variant="outlined"
              error={
                props.inputMissingError.lieferort ||
                props.inputWrongError.lieferort
              }
              helperText={
                props.inputMissingError.lieferort ? "Pflichtfeld" : null
              }
              type="text"
              required
              onChange={(event) => props.handleFieldChange(event)}
            />

            <TextField
              className="mb-3"
              sx={{ minWidth: 400, maxWidth: 600 }}
              id="warenort"
              name="warenort"
              label="Warenort (optional)"
              variant="outlined"
              onChange={(event) => props.handleFieldChange(event)}
            />
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

export default Lieferdaten;
