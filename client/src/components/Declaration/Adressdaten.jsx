import React from "react";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";

import TextField from "@mui/material/TextField";

import { Box } from "@mui/system";
import { Button } from "@mui/material";

function Adressdaten(props) {
  return (
    <>
      <h5 className="mb-4">Adressdaten</h5>

      <h6 className="mb-3">Versender</h6>
      <MDBRow>
        <MDBCol>
          <TextField
            className="me-3 mb-3"
            sx={{ minWidth: 250, maxWidth: 250 }}
            id="eoriVersender"
            name="eoriVersender"
            label="EORI-Nummer*"
            variant="outlined"
            disabled
            value={props.fieldValue.eoriVersender}
            error={
              props.inputMissingError.eoriVersender ||
              props.inputWrongError.eoriVersender
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
            sx={{ minWidth: 550, maxWidth: 550 }}
            id="firmaVersender"
            name="firmaVersender"
            label="Firma*"
            variant="outlined"
            disabled
            value={props.fieldValue.firmaVersender}
            error={
              props.inputMissingError.firmaVersender ||
              props.inputWrongError.firmaVersender
            }
            helperText={
              props.inputMissingError.firmaVersender ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3"
            sx={{ minWidth: 600, maxWidth: 600 }}
            id="strasseVersender"
            name="strasseVersender"
            label="Straße u. Hausnummer*"
            value={props.fieldValue.strasseVersender}
            disabled
            variant="outlined"
            error={
              props.inputMissingError.strasseVersender ||
              props.inputWrongError.strasseVersender
            }
            helperText={
              props.inputMissingError.strasseVersender ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3 me-3"
            sx={{ minWidth: 200, maxWidth: 200 }}
            id="plzVersender"
            name="plzVersender"
            label="Postleitzahl*"
            variant="outlined"
            value={props.fieldValue.plzVersender}
            disabled
            error={
              props.inputMissingError.plzVersender ||
              props.inputWrongError.plzVersender
            }
            helperText={
              props.inputMissingError.plzVersender
                ? "Pflichtfeld"
                : props.inputWrongError.plzVersender
                ? "Zahl eingeben"
                : null
            }
            onChange={(event) => props.handleNumberFieldChange(event)}
          />

          <TextField
            className="mb-3"
            sx={{ minWidth: 600, maxWidth: 900 }}
            id="ortVersender"
            name="ortVersender"
            label="Ort*"
            variant="outlined"
            disabled
            value={props.fieldValue.ortVersender}
            error={
              props.inputMissingError.ortVersender ||
              props.inputWrongError.ortVersender
            }
            helperText={
              props.inputMissingError.ortVersender ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3"
            sx={{ minWidth: 600, maxWidth: 900 }}
            id="staatVersender"
            name="staatVersender"
            label="Staatsangehörigkeit*"
            variant="outlined"
            disabled
            value={props.fieldValue.staatVersender}
            error={
              props.inputMissingError.staatVersender ||
              props.inputWrongError.staatVersender
            }
            helperText={
              props.inputMissingError.staatVersender ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3 me-3"
            sx={{ minWidth: 400, maxWidth: 600 }}
            id="telefonVersender"
            name="telefonVersender"
            label="Telefonnummer*"
            variant="outlined"
            value={props.fieldValue.telefonVersender}
            disabled
            error={
              props.inputMissingError.telefonVersender ||
              props.inputWrongError.telefonVersender
            }
            helperText={
              props.inputMissingError.telefonVersender ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />

          <TextField
            className="mb-3"
            sx={{ minWidth: 400, maxWidth: 600 }}
            id="emailVersender"
            name="emailVersender"
            label="E-Mail-Adresse*"
            variant="outlined"
            disabled
            value={props.fieldValue.emailVersender}
            error={
              props.inputMissingError.emailVersender ||
              props.inputWrongError.emailVersender
            }
            helperText={
              props.inputMissingError.emailVersender ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>

      <hr className="my-4" />

      <h6 className="mb-3">Empfänger / Anmelder</h6>
      <MDBRow>
        <MDBCol>
          <TextField
            className="me-3 mb-3"
            sx={{ minWidth: 250, maxWidth: 250 }}
            id="eoriAnmelder"
            name="eoriAnmelder"
            label="EORI-Nummer*"
            variant="outlined"
            value={props.fieldValue.eoriAnmelder}
            disabled
            error={
              props.inputMissingError.eoriAnmelder ||
              props.inputWrongError.eoriAnmelder
            }
            helperText={
              props.inputMissingError.eoriAnmelder
                ? "Pflichtfeld"
                : props.inputWrongError.eoriAnmelder
                ? "Zahl eingeben"
                : null
            }
            onChange={(event) => props.handleNumberFieldChange(event)}
          />

          <TextField
            className="mb-3"
            sx={{ minWidth: 550, maxWidth: 550 }}
            id="firmaAnmelder"
            name="firmaAnmelder"
            label="Firma*"
            variant="outlined"
            value={props.fieldValue.firmaAnmelder}
            disabled
            error={
              props.inputMissingError.firmaAnmelder ||
              props.inputWrongError.firmaAnmelder
            }
            helperText={
              props.inputMissingError.firmaAnmelder ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3"
            sx={{ minWidth: 600, maxWidth: 600 }}
            id="strasseAnmelder"
            name="strasseAnmelder"
            label="Straße u. Hausnummer*"
            variant="outlined"
            value={props.fieldValue.strasseAnmelder}
            disabled
            error={
              props.inputMissingError.strasseAnmelder ||
              props.inputWrongError.strasseAnmelder
            }
            helperText={
              props.inputMissingError.strasseAnmelder ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3 me-3"
            sx={{ minWidth: 200, maxWidth: 200 }}
            id="plzAnmelder"
            name="plzAnmelder"
            label="Postleitzahl*"
            variant="outlined"
            value={props.fieldValue.plzAnmelder}
            disabled
            error={
              props.inputMissingError.plzAnmelder ||
              props.inputWrongError.plzAnmelder
            }
            helperText={
              props.inputMissingError.plzAnmelder
                ? "Pflichtfeld"
                : props.inputWrongError.plzAnmelder
                ? "Zahl eingeben"
                : null
            }
            onChange={(event) => props.handleNumberFieldChange(event)}
          />

          <TextField
            className="mb-3"
            sx={{ minWidth: 600, maxWidth: 900 }}
            id="ortAnmelder"
            name="ortAnmelder"
            label="Ort*"
            variant="outlined"
            value={props.fieldValue.ortAnmelder}
            disabled
            error={
              props.inputMissingError.ortAnmelder ||
              props.inputWrongError.ortAnmelder
            }
            helperText={
              props.inputMissingError.ortAnmelder ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3"
            sx={{ minWidth: 600, maxWidth: 900 }}
            id="staatAnmelder"
            name="staatAnmelder"
            label="Staatsangehörigkeit*"
            variant="outlined"
            value={props.fieldValue.staatAnmelder}
            disabled
            error={
              props.inputMissingError.staatAnmelder ||
              props.inputWrongError.staatAnmelder
            }
            helperText={
              props.inputMissingError.staatAnmelder ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <TextField
            className="mb-3 me-3"
            sx={{ minWidth: 400, maxWidth: 600 }}
            id="telefonAnmelder"
            name="telefonAnmelder"
            label="Telefonnummer*"
            variant="outlined"
            value={props.fieldValue.telefonAnmelder}
            disabled
            error={
              props.inputMissingError.telefonAnmelder ||
              props.inputWrongError.telefonAnmelder
            }
            helperText={
              props.inputMissingError.telefonAnmelder ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />

          <TextField
            className="mb-3"
            sx={{ minWidth: 400, maxWidth: 600 }}
            id="emailAnmelder"
            name="emailAnmelder"
            label="E-Mail-Adresse*"
            variant="outlined"
            value={props.fieldValue.emailAnmelder}
            disabled
            error={
              props.inputMissingError.emailAnmelder ||
              props.inputWrongError.emailAnmelder
            }
            helperText={
              props.inputMissingError.emailAnmelder ? "Pflichtfeld" : null
            }
            onChange={(event) => props.handleFieldChange(event)}
          />
        </MDBCol>
      </MDBRow>
      {/* Stepper von Declaration*/}
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
    </>
  );
}

export default Adressdaten;
