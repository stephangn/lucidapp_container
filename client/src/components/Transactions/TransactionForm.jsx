import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function TransactionForm(props) {
  const [checkImporteur, setCheckImporteur] = useState(false);
  const [description, setDescription] = useState("");
  const [partnership, setPartnership] = useState("");
  const [partners, setPartners] = useState([]);
  const [partnerCompany, setPartnerCompany] = useState();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  useEffect(() => {
    //lookup partner for checkbox
    axiosPrivate.get("partnership/").then((res) => {
      setPartners(res.data);
    });
  }, []);

  // Datenbank Submit
  function handleSubmit(e) {
    let importeur = 1;
    if (checkImporteur) {
      importeur = auth.eori_nr;
      //console.log("Importeur ist eigene Firma");
    } else {
      importeur = partnerCompany;
    }
    //console.log("Die Importfirma ist", importeur);
    e.preventDefault();
    const newTransaction = {
      description,
      partnership,
      importeur,
    };
    //add transaction
    axiosPrivate
      .post("/transactions/", newTransaction)
      .then((res) => {
        props.setreload(!props.reload);
        // Modal schließen
        props.toggleShow();
        // Snackbar Alert setzen
        props.setSnackbarSuccess(true);
        props.setSnackbarMessage("Transaktion erfolgreich angelegt.");
        props.handleOpenSnackbar();
      })
      .catch((error) => {
        console.error("There was an error!", error);
        // Modal schließen
        props.toggleShow();
        // Snackbar Alert setzen
        props.setSnackbarSuccess(false);
        props.setSnackbarMessage("Fehler beim anlegen der Transaktion.");
        props.handleOpenSnackbar();
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <MDBContainer>
          <MDBRow>
            <MDBInput
              name="description"
              label="Beschreibung der Transaktion"
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            />
          </MDBRow>
          <div className="mt-4">Partner auswählen:</div>
          <MDBRow>
            <MDBCol>
              <Autocomplete
                className="mt-1"
                disablePortal
                id="combo-box-partner"
                options={partners}
                //choose name as label for ui
                getOptionLabel={(option) => option.partner.name}
                //when changed, save choosen Partner
                onChange={(event, value) => {
                  setPartnership(value.id);
                  setPartnerCompany(value.partner.eori_nr);
                }}
                sx={{ width: 320 }}
                renderInput={(params) => (
                  <TextField {...params} label="Partner" />
                )}
              />
            </MDBCol>
            <MDBCol>
              <Link to="/partners">
                <MDBIcon
                  far
                  icon="address-book"
                  className="float-end mt-3 me-4"
                  size="2x"
                />
              </Link>
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <FormControlLabel
              className="mt-3"
              control={
                <Checkbox onClick={() => setCheckImporteur(!checkImporteur)} />
              }
              label="Ist ihre Firma der Importeur?"
            />
          </MDBRow>
          {description == "" || partnership == "" ? (
            <MDBBtn
              disabled
              block
              type="submit"
              color="success"
              className="mt-4"
            >
              Hinzufügen
            </MDBBtn>
          ) : (
            <MDBBtn block type="submit" color="success" className="mt-4">
              Hinzufügen
            </MDBBtn>
          )}
        </MDBContainer>
      </form>
    </>
  );
}

export default TransactionForm;
