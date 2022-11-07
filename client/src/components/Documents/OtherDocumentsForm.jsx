import React, { useEffect, useState } from "react";
import { uploadDokumentHash, getDokumentenhash } from "../../Web3Client";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { MDBInput, MDBFile, MDBBtn, MDBContainer } from "mdb-react-ui-kit";
import { MDBSpinner } from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const steps = ["Dokument beschreiben", "Dokument hochladen", "Bestätigen"];

function OtherDocumentsForm(props) {
  const axiosInstance = useAxiosPrivate();

  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [issueDate, setIssueDate] = React.useState("");
  const [fileID, setFileID] = React.useState();

  const [fileLink, setFileLink] = React.useState("");

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const [selectedFile, setSelectedFile] = React.useState();
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = React.useState(false);
  const { transactionId } = useParams();
  const [newDocumentData, setNewDocumentData] = useState();
  const { auth } = useAuth();

  var newDocumentID;

  const docformData = new FormData();

  // -- Loading Backdrop --
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  // Funktion für Datei Upload
  function handleUpload(e) {
    e.preventDefault();
    setUploadLoading(true);
    const fileformData = new FormData();
    fileformData.append("file", selectedFile);

    axiosInstance
      .post("/file/", fileformData)
      .then((res) => {
        setFileID(res.data.id);

        setFileLink(res.data.file);
        setFileUploadSuccess(true);
        setUploadLoading(false);
      })
      .catch((err) => console.log(err.response));
  }
  async function uDokumentHash(_transaktionID, _file) {
    var crypto = require("crypto");
    const fileReader = new FileReader();
    var hashwert = "";
    fileReader.readAsText(_file);
    fileReader.onload = function (evt) {
      hashwert = crypto
        .createHash("sha512")
        .update(evt.target.result)
        .digest("hex");

      uploadDokumentHash(_transaktionID, hashwert) //Blockchain Transaktion
        .then((tx) => {
          docformData.append("blockchain_id", tx - 1);
          uploadToDatabase(docformData);
          return tx;
        })
        .catch((err) => {
          console.log("Hashgenerierung fehlgeschlagen. Fehlermeldung: " + err);
          // Error-Snackbar setzen
          props.setSnackbarSuccess(false);
          props.setSnackbarMessage(
            "Fehler bei der Verarbeitung des Dokuments."
          );
          // Backdrop Ladeanimation schließen
          handleCloseBackdrop();
          // Snackbar öffnen
          props.handleOpenSnackbar();
          // Modal schließen
          props.toggleAddDocumentModal();
        });
    };
  }

  // DB Upload
  async function uploadToDatabase(docformData) {
    await axiosInstance
      .post("/documents/", docformData)
      .then((res) => {
        setNewDocumentData(res.data);
        newDocumentID = res.data.id;
        console.log("Dokument erfolgreich hochgeladen.");
        // newDocument -> State aktualisieren
        props.setNewDocument(!props.newDocument);
        // Erfolgs-Snackbar setzen
        props.setSnackbarSuccess(true);
        props.setSnackbarMessage("Dokument erfolgreich hochgeladen.");
        // Backdrop Ladeanimation öffnen
        handleToggleBackdrop();
        // Snackbar öffnen
        props.handleOpenSnackbar();
        // Modal schließen
        props.toggleAddDocumentModal();
      })
      .catch((err) => {
        console.log(err.response);
        // Error-Snackbar setzen
        props.setSnackbarSuccess(false);
        props.setSnackbarMessage("Fehler beim hochladen des Dokuments.");
        // Backdrop Ladeanimation öffnen
        handleToggleBackdrop();
        // Snackbar öffnen
        props.handleOpenSnackbar();
        // Modal schließen
        props.toggleAddDocumentModal();
      });
  }

  // Funktion zum Abschicken des Formulars
  async function handleSubmit(e) {
    //Standardverhalten abstellen
    e.preventDefault();
    // Backdrop Ladeanimation öffnen
    handleToggleBackdrop();
    docformData.append("description", description);
    docformData.append("type", type);
    docformData.append("file", fileID);
    docformData.append("issue_date", "2022-03-15");
    if (transactionId == undefined) {
      console.log("Zollmodus mit Transaction ID: " + props.transactionID_zoll);
      docformData.append("transaction", props.transactionID_zoll);
      const tx = await uDokumentHash(props.transactionID_zoll, selectedFile);
    } else {
      docformData.append("transaction", transactionId);
      const tx = await uDokumentHash(transactionId, selectedFile);
    }
  }

  // Alle Funktionen unterhalb: Steuerung des Steppers

  // Kein Step ist optional
  const isStepOptional = (step) => {
    return;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 0) {
      var forms = document.getElementById("documentForm");

      if (forms.checkValidity() == false) {
        console.log("Formular Eingabe inkorrekt.");
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Wenn Nutzer = Zoll Dokumententyp: "Zollbescheid"
  useEffect(() => {
    if (props?.isZoll == true) {
      setType("Zollbescheid");
    }
  }, []);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <MDBContainer className="mt-4">
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Zurücksetzen</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 ? (
                <>
                  <form id="documentForm" onSubmit={(e) => e.preventDefault()}>
                    {props?.isZoll == true ? (
                      <MDBInput
                        className="my-4"
                        value={"Zollbescheid"}
                        name="type"
                        id="documentType"
                        label="Dokumententyp"
                        disabled
                        onChange={(e) => setType(e.target.value)}
                        type="text"
                      />
                    ) : (
                      <MDBInput
                        className="my-4"
                        value={type}
                        name="type"
                        id="documentType"
                        label="Dokumententyp"
                        required
                        onChange={(e) => setType(e.target.value)}
                        type="text"
                      />
                    )}

                    <MDBInput
                      wrapperClass="mb-4"
                      value={description}
                      textarea
                      name="description"
                      id="documentDescription"
                      rows={3}
                      onChange={(e) => setDescription(e.target.value)}
                      label="Beschreibung (optional)"
                    />
                  </form>
                  {type.toUpperCase() == "RECHNUNG" && (
                    <p className="errmsg alert alert-danger">
                      Bezeichnung "Rechnung" nicht zulässig. Rechnungsformular
                      verwenden.
                    </p>
                  )}
                </>
              ) : activeStep === 1 ? (
                <>
                  <form onSubmit={handleUpload}>
                    <MDBFile
                      className="my-4"
                      label="PDF-Dokument auswählen"
                      id="customFile"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    {selectedFile === undefined || selectedFile == "" ? (
                      <MDBBtn disabled type="submit" block>
                        Hochladen
                      </MDBBtn>
                    ) : uploadLoading == false ? (
                      <MDBBtn type="submit" block>
                        Hochladen
                      </MDBBtn>
                    ) : (
                      <MDBBtn type="submit" block disabled>
                        <MDBSpinner
                          size="sm"
                          role="status"
                          tag="span"
                          className="me-2"
                        />
                        Hochladen...
                      </MDBBtn>
                    )}
                  </form>
                  {fileUploadSuccess && (
                    <Alert severity="success" className="mt-4">
                      Dokument wurde verarbeitet. Weiter um Upload
                      abzuschließen.
                    </Alert>
                  )}
                </>
              ) : (
                <>
                  <h5 className="mt-4">Daten bestätigen:</h5>
                  <p>
                    <b>Hochgeladene Dokumentenart: </b>
                    <br />
                    {type}
                  </p>
                  <p>
                    <b>Beschreibung: </b>
                    <br />
                    {description == "" ? (
                      <i>Keine Beschreibung.</i>
                    ) : (
                      description
                    )}
                  </p>

                  <p>
                    <a
                      href={fileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link zur Datei
                    </a>
                  </p>
                </>
              )}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Zurück
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Überspringen
                  </Button>
                )}

                {activeStep === steps.length - 1 ? (
                  <Button onClick={handleSubmit}>Abschicken</Button>
                ) : activeStep == 1 && fileUploadSuccess == false ? (
                  <Button disabled onClick={handleNext}>
                    Weiter
                  </Button>
                ) : activeStep == 1 && fileUploadSuccess == true ? (
                  <Button onClick={handleNext}>Weiter</Button>
                ) : (
                  <Button
                    type="submit"
                    form="documentForm"
                    onClick={handleNext}
                  >
                    Weiter
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </MDBContainer>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default OtherDocumentsForm;
