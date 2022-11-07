import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./css/LoadingSpinner.css";

// Unterformulare
import AllgemeineAngaben from "../components/Declaration/AllgemeineAngaben";
import Adressdaten from "../components/Declaration/Adressdaten";
import Lieferdaten from "../components/Declaration/Lieferdaten";
import Rechnungsdaten from "../components/Declaration/Rechnungsdaten";
import AnmeldungDokumente from "../components/Declaration/AnmeldungDokumente";

import {
  MDBContainer,
  MDBSpinner,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from "mdb-react-ui-kit";

//Smart Contract
import { createZollanmeldung } from "../Web3Client";

// Stepper
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// Loading Backdrop
import Backdrop from "@mui/material/Backdrop";

//Nutzerdaten Abruf
import useAuth from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";

function Declaration(props) {
  const [usedInvoice, setUsedInvoice] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [pubkeyCO, setPubkeyCO] = useState();
  const [transactionInvoices, setTransactionInvoices] = useState();

  //state für dokumente

  const usedDocuments = [];
  const [documents, setDocuments] = useState();

  //auswahl für Zollämter

  const [customOffices, setCustomOffices] = useState({});

  //funktion für Nutzerdaten
  const { auth } = useAuth();

  //Abfrage der TransaktionsID

  const { transactionId } = useParams();

  // Stepper-Logik
  const steps = [
    "Allgemeine Angaben",
    "Adressdaten",
    "Lieferdaten",
    "Rechnungsdaten",
    "Dokumente",
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  // (Kein Step ist optional)
  const isStepOptional = (step) => {
    return;
  };

  //Abfrage der voreingestellten Daten
  const axiosInstance = useAxiosPrivate();

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (e) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    // Check Validierung
    if (activeStep === 0 && allgemeineAngabenValidity == false) {
      return;
    }
    if (activeStep === 2 && lieferdatenValidity == false) {
      return;
    }
    if (activeStep === 3 && rechnungsdatenValidity == false) {
      return;
    }
    e.preventDefault();
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

  //Übertragen der Daten
  async function handleSubmit() {
    // Backdrop Ladeanimation öffnen
    handleToggleBackdrop();
    const zollwert = (await fieldValue.gesamtbetrag) + fieldValue.lieferkosten;
    await blockchainZollanmeldungTransaction(
      pubkeyCO,
      fieldValue.blockchainRID,
      zollwert.toString(),
      fieldValue.lieferbedingung
    );

    return;
  }

  // -- DATENFELDER --
  // State des Inhalts der Felder
  const [fieldValue, setFieldValue] = React.useState({
    // Allgemeine Angaben
    auftragsnummer: "",
    bearbeitendeDienststelle: "",
    anmeldungArt: "",
    geschaeftArt: "",
    zahlungArt: "",
    // Adressdaten Versender
    eoriVersender: "",
    nameVersender: "",
    vornameVersender: "",
    firmaVersender: "",
    strasseVersender: "",
    plzVersender: "",
    ortVersender: "",
    staatVersender: "",
    telefonVersender: "",
    emailVersender: "",
    // Adressdaten Anmelder
    eoriAnmelder: "",
    nameAnmelder: "",
    vornameAnmelder: "",
    firmaAnmelder: "",
    strasseAnmelder: "",
    plzAnmelder: "",
    ortAnmelder: "",
    staatAnmelder: "",
    telefonAnmelder: "",
    emailAnmelder: "",
    // Lieferdaten
    ausfuhrland: "",
    bestimmungsland: "",
    bestimmungsbundesland: "",
    befoerderungsmittel: "",
    lieferbedingung: "",
    lieferort: "",
    warenort: "",
    lieferkosten: "",
    //Rechnungsdaten
    datumRechnung: "",
    gesamtbetrag: "",
    waehrung: "",
  });

  const [rechnungsposten, setRechnungsposten] = React.useState([{}]);

  // Legacy State über fehlende Eingaben
  // -> Keine manuelle Validierung mehr, sondern HTML5 Required-Validierung
  const [inputMissingError, setInputMissingError] = React.useState({
    // Allgemeine Angaben
    auftragsnummer: false,
    bearbeitendeDienststelle: false,
    anmeldungArt: false,
    geschaeftArt: false,
    zahlungArt: false,
    // Adressdaten Versender
    eoriVersender: false,
    nameVersender: false,
    vornameVersender: false,
    firmaVersender: false,
    strasseVersender: false,
    plzVersender: false,
    ortVersender: false,
    staatVersender: false,
    telefonVersender: false,
    emailVersender: false,
    // Adressdaten Anmelder
    eoriAnmelder: false,
    nameAnmelder: false,
    vornameAnmelder: false,
    firmaAnmelder: false,
    strasseAnmelder: false,
    plzAnmelder: false,
    ortAnmelder: false,
    staatAnmelder: false,
    telefonAnmelder: false,
    emailAnmelder: false,
    // Lieferdaten
    ausfuhrland: false,
    bestimmungsland: false,
    bestimmungsbundesland: false,
    befoerderungsmittel: false,
    lieferbedingung: false,
    lieferort: false,
    warenort: false,
    lieferkosten: false,
    //Rechnungsdaten
    datumRechnung: false,
    gesamtbetrag: false,
    waehrung: false,
  });

  // Legacy State über falsche Inputs (müssen Zahlen sein)
  // -> Keine manuelle Validierung mehr, sondern HTML5 Required-Validierung
  const [inputWrongError, setInputWrongError] = React.useState({
    auftragsnummer: false,
    eoriVersender: false,
    plzVersender: false,
    eoriAnmelder: false,
    plsAnmelder: false,
    lieferkosten: false,
  });

  // Neue Validierung-States
  const [allgemeineAngabenValidity, setAllgemeineAngabenValidity] =
    useState(false);
  const [lieferdatenValidity, setLieferdatenValidity] = useState(false);
  const [rechnungsdatenValidity, setRechnungsdatenValidity] = useState(false);

  // FieldChange für Select und String-Felder
  function handleFieldChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setFieldValue({ ...fieldValue, [name]: value });
    setInputMissingError({ ...inputMissingError, [name]: false });
  }

  // FieldChange für Zahlen-Inputfelder
  function handleNumberFieldChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    // Validierung: nur Zahlen
    if (isNaN(value)) {
      setInputWrongError({ ...inputWrongError, [name]: true });
    } else {
      setInputWrongError({ ...inputWrongError, [name]: false });
    }

    setFieldValue({ ...fieldValue, [name]: value });
    setInputMissingError({ ...inputMissingError, [name]: false });
  }

  // Abfragen der Bestandsdaten

  useEffect(async () => {
    await axiosInstance.get(`transactions/` + transactionId).then((res) => {
      setFieldValue((prev) => {
        return {
          ...prev,
          auftragsnummer: res.data.id,
          eoriVersender: res.data.partnership.partner.eori_nr,
          //nameVersender: .partnership.partner.name,
          firmaVersender: res.data.partnership.partner.name,
          strasseVersender: res.data.partnership.partner.street,
          plzVersender: res.data.partnership.partner.city_code,
          ortVersender: res.data.partnership.partner.city,
          staatVersender: res.data.partnership.partner.country_code,
          telefonVersender: res.data.partnership.partner.phone,
          emailVersender: res.data.partnership.partner.email,
          exporteur_pubkey: res.data.partnership.partner.publickey,
        };
      });
      setIsLoading(false);
    });

    //Abfrage der eigenen Nutzerdaten

    await axiosInstance.get(`user/`).then((response) => {
      setFieldValue((prev) => {
        return {
          ...prev,
          eoriAnmelder: response.data[0].employee?.company.eori_nr,
          //nameVersender: .partnership.partner.name,
          firmaAnmelder: response.data[0].employee.company.name,
          strasseAnmelder: response.data[0].employee.company.street,
          plzAnmelder: response.data[0].employee.company.city_code,
          ortAnmelder: response.data[0].employee.company.city,
          staatAnmelder: response.data[0].employee.company.country_code,
          telefonAnmelder: response.data[0].employee.company.phone,
          emailAnmelder: response.data[0].employee.company.email,
        };
      });
    });

    //Abfrage der Rechnungen für Auswahl

    await axiosInstance
      .get(`invoice/?transaction=${transactionId}`)
      .then((response) => {
        setTransactionInvoices(response.data);
      });

    //Abfrage der Zollstationen
    await axiosInstance.get("customoffices/").then((res) => {
      setCustomOffices(res.data);
      //setCompanies(res.data);
    });
    //Abfrage der Documente
    await axiosInstance
      .get("documents/?transaction=" + transactionId)
      .then((res) => {
        setDocuments(res.data);
        //setCompanies(res.data);
      });
  }, [transactionId]);

  //Abfrage der Rechnungsdaten
  useEffect(async () => {
    if (typeof usedInvoice !== "undefined") {
      await axiosInstance.get(`invoice/${usedInvoice}/`).then((response) => {
        setFieldValue((prev) => {
          return {
            ...prev,
            waehrung: response.data?.currency,
            datumRechnung: response.data?.issue_date,
            gesamtbetrag: response.data?.total_value,
            lieferkosten: response.data?.transport_costs,
            gesamtbetrag: response.data?.total_value,
            blockchainRID: response.data?.blockchain_id,
            rechnungID: response.data?.id,
          };
        });
        setRechnungsposten(response.data?.invoiceItem);
      });
    }
  }, [usedInvoice]);

  // Blockchain Transaktion
  async function blockchainZollanmeldungTransaction(
    _zoll,
    _rechnungID,
    _zollwert,
    _incoterms
  ) {
    var erfolgreich = false;
    await createZollanmeldung(_zoll, _rechnungID, _zollwert, _incoterms)
      .then((tx) => {
        console.log(tx);
        erfolgreich = true;
        axiosInstance
          .post("/declaration/", {
            anmeldeArt: fieldValue.anmeldungArt,
            geschaeftArt: fieldValue.geschaeftArt,
            zahlungsart: fieldValue?.zahlungArt,
            ausfuhrland: fieldValue.ausfuhrland,
            bestimmungsland: fieldValue.bestimmungsland,
            befoerderungsmittel: fieldValue.befoerderungsmittel,
            lieferbedingung: fieldValue.lieferbedingung,
            lieferort: fieldValue.lieferort,
            warenort: fieldValue?.warenort,
            invoice: usedInvoice,
            transaction: transactionId,
            customs_office: fieldValue.bearbeitendeDienststelle,
            blockchain_zid: tx - 1,
            document: usedDocuments,
          })
          .then((res) => {
            // Backdrop Ladeanimation schließen
            handleCloseBackdrop();
            handleNavigate(true, "Zollanmeldung angelegt und übermittelt.");
          })
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              // Backdrop Ladeanimation schließen
              handleCloseBackdrop();
              handleNavigate(false, "Fehler bei Erstellung der Zollanmeldung.");
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
              handleNavigate(false, "Fehler bei Erstellung der Zollanmeldung.");
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
              handleNavigate(false, "Fehler bei Erstellung der Zollanmeldung.");
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
    return erfolgreich;
  }

  // Navigation an DocumentsNew
  //+ State: Informationen für Snackbar Alert

  let navigate = useNavigate();

  function handleNavigate(snackSuccess, snackMessage) {
    let urladdress = "/transactions/" + fieldValue.auftragsnummer;
    navigate(urladdress, {
      replace: true,
      state: { success: snackSuccess, message: snackMessage },
    });
  }

  // -- Loading Backdrop --
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

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
          <h3>Zollanmeldung erstellen</h3>
          <MDBBreadcrumb>
            <MDBBreadcrumbItem>
              <Link to="/transactions">Aufträge</Link>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem>
              <Link to={"/transactions/" + transactionId}>
                Auftrags-ID {transactionId}
              </Link>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem active>Formular Zollanmeldung</MDBBreadcrumbItem>
          </MDBBreadcrumb>
          <br />
          <div>
            <Box sx={{ width: "100%" }}>
              <Stepper className="mb-3" activeStep={activeStep}>
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
                      <MDBContainer>
                        <AllgemeineAngaben
                          fieldValue={fieldValue}
                          customOffices={customOffices}
                          setPubkeyCO={setPubkeyCO}
                          setFieldValue={setFieldValue}
                          inputMissingError={inputMissingError}
                          setInputMissingError={setInputMissingError}
                          inputWrongError={inputWrongError}
                          setInputWrongError={setInputWrongError}
                          handleFieldChange={handleFieldChange}
                          handleNumberFieldChange={handleNumberFieldChange}
                          // Validierung State
                          allgemeineAngabenValidity={allgemeineAngabenValidity}
                          setAllgemeineAngabenValidity={
                            setAllgemeineAngabenValidity
                          }
                          // Stepper Funktionen
                          handleBack={handleBack}
                          isStepOptional={isStepOptional}
                          activeStep={activeStep}
                          handleSkip={handleSkip}
                          activeStep={activeStep}
                          steps={steps}
                          handleSubmit={handleSubmit}
                          handleNext={handleNext}
                        />
                      </MDBContainer>
                    </>
                  ) : activeStep === 1 ? (
                    <>
                      <MDBContainer>
                        <Adressdaten
                          fieldValue={fieldValue}
                          setFieldValue={setFieldValue}
                          inputMissingError={inputMissingError}
                          setInputMissingError={setInputMissingError}
                          inputWrongError={inputWrongError}
                          setInputWrongError={setInputWrongError}
                          handleFieldChange={handleFieldChange}
                          handleNumberFieldChange={handleNumberFieldChange}
                          // Stepper Funktionen
                          handleBack={handleBack}
                          isStepOptional={isStepOptional}
                          activeStep={activeStep}
                          handleSkip={handleSkip}
                          activeStep={activeStep}
                          steps={steps}
                          handleSubmit={handleSubmit}
                          handleNext={handleNext}
                        />
                      </MDBContainer>
                    </>
                  ) : activeStep === 2 ? (
                    <>
                      <MDBContainer>
                        <Lieferdaten
                          fieldValue={fieldValue}
                          setFieldValue={setFieldValue}
                          inputMissingError={inputMissingError}
                          setInputMissingError={setInputMissingError}
                          inputWrongError={inputWrongError}
                          setInputWrongError={setInputWrongError}
                          handleFieldChange={handleFieldChange}
                          handleNumberFieldChange={handleNumberFieldChange}
                          // Validierung State
                          lieferdatenValidity={lieferdatenValidity}
                          setLieferdatenValidity={setLieferdatenValidity}
                          // Stepper Funktionen
                          handleBack={handleBack}
                          isStepOptional={isStepOptional}
                          activeStep={activeStep}
                          handleSkip={handleSkip}
                          activeStep={activeStep}
                          steps={steps}
                          handleSubmit={handleSubmit}
                          handleNext={handleNext}
                        />
                      </MDBContainer>
                    </>
                  ) : activeStep === 3 ? (
                    <>
                      <MDBContainer>
                        <Rechnungsdaten
                          fieldValue={fieldValue}
                          setFieldValue={setFieldValue}
                          inputMissingError={inputMissingError}
                          setInputMissingError={setInputMissingError}
                          inputWrongError={inputWrongError}
                          setInputWrongError={setInputWrongError}
                          handleFieldChange={handleFieldChange}
                          handleNumberFieldChange={handleNumberFieldChange}
                          rechnungsposten={rechnungsposten}
                          setRechnungsposten={setRechnungsposten}
                          transactionInvoices={transactionInvoices}
                          usedInvoice={usedInvoice}
                          setUsedInvoice={setUsedInvoice}
                          // Validierung State
                          rechnungsdatenValidity={rechnungsdatenValidity}
                          setRechnungsdatenValidity={setRechnungsdatenValidity}
                          // Stepper Funktionen
                          handleBack={handleBack}
                          isStepOptional={isStepOptional}
                          activeStep={activeStep}
                          handleSkip={handleSkip}
                          activeStep={activeStep}
                          steps={steps}
                          handleSubmit={handleSubmit}
                          handleNext={handleNext}
                        />
                      </MDBContainer>
                    </>
                  ) : (
                    <>
                      <MDBContainer>
                        <AnmeldungDokumente
                          usedDocuments={usedDocuments}
                          documents={documents}
                          // Stepper Funktionen
                          handleBack={handleBack}
                          isStepOptional={isStepOptional}
                          activeStep={activeStep}
                          handleSkip={handleSkip}
                          activeStep={activeStep}
                          steps={steps}
                          handleSubmit={handleSubmit}
                          handleNext={handleNext}
                        />
                      </MDBContainer>
                    </>
                  )}
                </React.Fragment>
              )}
            </Box>
          </div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openBackdrop}
            onClick={handleCloseBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
    </>
  );
}

export default Declaration;
