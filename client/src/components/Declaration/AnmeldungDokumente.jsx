import React, { useEffect, useState } from "react";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";

import { Button, FormGroup } from "@mui/material";
import { Checkbox } from "@mui/material";

import { FormControlLabel } from "@mui/material";
import { Box } from "@mui/system";

function AnmeldungDokumente(props) {
  const handleChange = (documentID) => {
    if (props.usedDocuments.includes(documentID)) {
      console.log(`${documentID} bereits enthalten - wird entfernt`);
      const index = props.usedDocuments.indexOf(documentID);
      if (index > -1) {
        props.usedDocuments.splice(index, 1); // 2nd parameter means remove one item only
      }
      return;
    }
    props.usedDocuments.push(documentID);
  };

  return (
    <>
      <h5 className="mb-4">Weitere Dokumente</h5>
      <MDBRow>
        <MDBCol>Sonstige Dokumente auswählen (optional):</MDBCol>
      </MDBRow>
      <MDBRow>
        <FormGroup>
          {/* Dokumente werden aufgelistet, Rechnungen werden rausgefiltert */}
          {props.documents
            .filter((document) => document.type !== "Rechnung")
            .map((document) => (
              <FormControlLabel
                control={
                  <Checkbox onChange={() => handleChange(document.id)} />
                }
                label={document.representation}
              />
            ))}
        </FormGroup>
      </MDBRow>
      {/* Stepper */}
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

export default AnmeldungDokumente;
