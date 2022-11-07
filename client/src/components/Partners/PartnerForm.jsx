import React, { useState, useEffect } from "react";
import { MDBContainer, MDBInput, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function PartnerForm(props) {
  const [eori_nr, setEoriNr] = useState("");
  const [companies, setCompanies] = useState([]);
  const [requestedCompany, setrequestedCompany] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [testRerender, setTestRerender] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isCurrentPartnership, setIsCurrentPartnership] = useState(false);
  const [partnerships, setPartnerships] = useState();
  const { auth } = useAuth();
  //useffect Abfragen der Firmemliste

  // DB Call
  useEffect(() => {
    axiosPrivate.get("partnership/").then((res) => {
      setPartnerships(res.data);
    });
  }, [testRerender]);

  // EORI Suche
  async function handleEORISearch() {
    var forms = document.getElementById("partnerForm");

    if (forms.checkValidity() == false) {
      //console.log("Formular Eingabe inkorrekt.");
      return;
    }

    //Leeren wenn neu gesucht wird
    setCompanies();
    setNotFound(false);
    setIsCurrentPartnership(false);

    await axiosPrivate
      .get(`companies/${eori_nr}/`)
      .then((res) => {
        setCompanies(res.data);

        if (
          partnerships.some(
            (partnerships) => partnerships.partner.eori_nr == res.data.eori_nr
          ) ||
          auth.eori_nr == res.data.eori_nr
        ) {
          setIsCurrentPartnership(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setNotFound(true);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    //firma hinzufügen
    console.log("Added Partner: " + companies.eori_nr);
    axiosPrivate
      .post("/partnership/", { added_partner: companies.eori_nr })
      .then(
        // setTestRerender(true),
        // Reload Partern State
        props.setNewPartner(!props.newPartner),
        // Snackbar Alert
        props.setSnackbarSuccess(true),
        props.setSnackbarMessage("Partneranfrage gesendet."),
        props.handleOpenSnackbar(),
        // Modal schließen
        props.toggleShow()
      )
      .catch((error) => {
        console.error("There was an error!", error);
        // Snackbar definieren
        props.setSnackbarSuccess(false);
        props.setSnackbarMessage("Fehler beim Anfragen der Handelsbeziehung.");
        props.handleOpenSnackbar();
        // Modal schließen
        props.toggleShow();
      });

    //firma als partner hinterlegen
  }

  return (
    <>
      <MDBContainer>
        <form id="partnerForm" onSubmit={(e) => e.preventDefault()}>
          <MDBInput
            className="my-3"
            name="eori_nr"
            label="EORI-Nr."
            type="number"
            required
            onChange={(e) => setEoriNr(e.target.value)}
          />
          {eori_nr == "" ? (
            <MDBBtn
              block
              className="mb-4"
              type="search"
              color="primary"
              disabled
              onClick={(e) => handleEORISearch()}
            >
              <MDBIcon size="lg" className="me-2" fas icon="search" />
              Unternehmen suchen
            </MDBBtn>
          ) : (
            <MDBBtn
              block
              className="mb-4"
              color="primary"
              type="submit"
              onClick={(e) => handleEORISearch()}
            >
              <MDBIcon size="lg" className="me-2" fas icon="search" />
              Unternehmen suchen
            </MDBBtn>
          )}
        </form>
        {notFound && <p> EORI-NR nicht gefunden, bitte erneut probieren</p>}
        {companies?.name != undefined && (
          <p>
            {" "}
            Treffer: <br />
            <b>
              {companies?.name} <br />
              {companies?.street} <br />
              {companies?.city_code} {companies?.city} <br />
              {companies?.country_code}
            </b>
          </p>
        )}
        {isCurrentPartnership && (
          <p>
            {" "}
            Eine Partnerschaft existiert mit diesem Unternehmen bereits oder es
            ist ihr eigenes Unternehmen.
          </p>
        )}

        {companies?.name != undefined && isCurrentPartnership == false ? (
          <MDBBtn
            block
            className="mt-3"
            type="submit"
            onClick={(e) => handleSubmit(e)}
            color="success"
          >
            Anfrage stellen
          </MDBBtn>
        ) : null}
      </MDBContainer>
    </>
  );
}

export default PartnerForm;
