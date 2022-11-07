import { React, useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CardModal from "./CardModal";
//Hook für Contextabruf
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { getDokumentenHash } from "../../Web3Client";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function DocumentCard(props) {
  const axiosInstance = useAxiosPrivate();
  //Context mit Nutzerdaten abrufen
  const { auth } = useAuth();
  const [datei, setDatei] = useState([]);
  const [fileLink, setFileLink] = useState("");
  const [ShowConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isVerified, setIsVerified] = useState("ausstehend");

  const author_company = props.author_company;

  useEffect(() => {
    //Abruf des Link zur Datei

    if (props.file != null)
      axiosInstance.get("file/" + props.file).then((res) => {
        setDatei(res.data);
        setFileLink(res.data.file);
      }, []);
  }, [ShowConfirmation]);

  async function getFileFromUrl(url, defaultType = "image/jpeg") {
    const response = await fetch(url);
    const data = await response.blob();
    var name = name;
    return new File([data], name, {
      type: data.type || defaultType,
    });
  }

  async function verifyDocument(id) {
    // Backdrop Ladeanimation öffnen
    handleToggleBackdrop();
    const file = await getFileFromUrl(fileLink);
    proofFilehash(id, file, function (hashwert) {
      getDokumentenHash(props.blockchain_did) //Blockchain Transaktion
        .then((tx) => {
          if (hashwert == tx) {
            setIsVerified("Hash korrekt");

            // Backdrop Ladeanimation schließen
            handleCloseBackdrop();
            return true;
          } else {
            setIsVerified("Hash inkorrekt");

            // Backdrop Ladeanimation schließen
            handleCloseBackdrop();
            return false;
          }
        })
        .catch((err) => {
          console.log("Fehlgeschlagen. Fehlermeldung: " + err);

          // Backdrop Ladeanimation schließen
          handleCloseBackdrop();
        });
    });
  }

  async function proofFilehash(_DokumentID, _file, callback) {
    //Download der Datei
    var crypto = require("crypto");
    var hashwert = "";
    const fileReader = new FileReader();
    fileReader.readAsText(_file);
    fileReader.onload = function (e) {
      hashwert = crypto
        .createHash("sha512")
        .update(e.target.result)
        .digest("hex");
      callback(hashwert);
    };
  }

  // State für "Dokument anzeigen" Modal
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  // Funktion für Manipulation von Modal (als props weitergereicht)
  function toggleShowDocumentModal() {
    setShowDocumentModal(!showDocumentModal);
  }

  // -- Loading Backdrop --
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  return (
    <>
      <MDBCard className="h-100" style={{ minHeight: "250px", width: "510px" }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol sm="2" className="d-flex justify-content-center">
              {props.type == "Rechnung" ? (
                <MDBIcon
                  className="mt-2"
                  fas
                  size="4x"
                  icon="file-invoice-dollar"
                />
              ) : (
                <MDBIcon className="mt-2" fas size="4x" icon="file-alt" />
              )}
            </MDBCol>
            <MDBCol sm="8">
              <MDBCardTitle>
                {props.type + " " + "(" + props.documentDate + ")"}
              </MDBCardTitle>

              <MDBCardText className="mt-2 me-5">
                <b>Beschreibung: </b>
                <br />
                {props.description == "" ? (
                  <i>Es liegt keine Beschreibung vor.</i>
                ) : (
                  props.description
                )}
                <br />
                {(props?.isZoll && props.type !== "Rechnung") ||
                props.type == "Zollbescheid" ? (
                  <>
                    <b>Verifikation: </b>
                    {isVerified}
                  </>
                ) : null}
              </MDBCardText>
            </MDBCol>
            <MDBCol sm="2">
              <Link
                style={{ display: "block", margin: "1rem 0" }}
                to={"document/" + props.id.toString()}
                key={props.id}
                params={{ title: "Hello" }}
              >
                <MDBBtn
                  className="float-end"
                  outline
                  onClick={toggleShowDocumentModal}
                >
                  Anzeigen
                </MDBBtn>
              </Link>
              {(props?.isZoll && props.type !== "Rechnung") ||
              props.type == "Zollbescheid" ? (
                <MDBBtn
                  className="float-end mt-3"
                  outline
                  onClick={verifyDocument}
                >
                  Verifizieren
                </MDBBtn>
              ) : null}
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
        <MDBCardFooter className="text-muted">
          Hochgeladen am: {props.uploadDate}
          <br />
          von {props.author_company} ({props.author})
        </MDBCardFooter>
      </MDBCard>
      <CardModal
        basicModal={showDocumentModal}
        setBasicModal={setShowDocumentModal}
        toggleShow={toggleShowDocumentModal}
        title={props.title}
        description={props.description}
      />
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

export default DocumentCard;
