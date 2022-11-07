import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBBtn,
  MDBCol,
  MDBBadge,
} from "mdb-react-ui-kit";
import { TextField } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Partner from "../components/Partners/Partner";
import Transaction from "../components/Transactions/Transaction";
import { Divider } from "@mui/material";
import { useSearchParams } from "react-router-dom";

function Search(props) {
  const axiosInstance = useAxiosPrivate();

  const [query, setQuery] = useState("");

  const [resultsTransaction, setResultsTransactions] = useState([]);

  const [resultsPartnerships, setResultsPartnerships] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [declarationData, setDeclarationData] = useState([]);

  const [activeSearch, setActiveSearch] = useState(false);

  const { search } = window.location;
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setQuery(suchbegriff);
  }, []);

  let suchbegriff = searchParams.get("");

  useEffect(async () => {
    if (suchbegriff) {
      let queryFix = suchbegriff;
      setQuery(suchbegriff);
      handleSearch(queryFix);
    }
  }, [suchbegriff]);

  //Bisher Suche nur nach Transaktionen
  function handleSearch(queryset) {
    axiosInstance.get("transactions/?search=" + queryset).then((res) => {
      console.log(res);
      setResultsTransactions(res.data);
    });
    axiosInstance.get("partnership/?search=" + queryset).then((res) => {
      console.log(res);
      setResultsPartnerships(res.data);
    });
    console.log("hier steht eine suche mit dem suchwort" + queryset);
    // Dokumente abrufen

    axiosInstance.get("documents/").then((res) => {
      setDocumentsData(res.data);
    });
    // Zollanmeldungen abrufen

    axiosInstance.get("declaration/").then((res) => {
      setDeclarationData(res.data);
      console.log(res.data);
    });

    setActiveSearch(true);
  }

  return (
    <div>
      <MDBContainer>
        <MDBRow>
          <h3>Suche</h3>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <TextField
              className="my-3"
              sx={{ width: 550 }}
              id="suchbegriff"
              name="suchbegriff"
              label="Suchbegriff"
              variant="outlined"
              value={query}
              onChange={(event) => {
                setActiveSearch(false);
                setQuery(event.target.value);
              }}
            />
          </MDBCol>
          <MDBCol>
            <MDBBtn
              className="mt-4 float-start"
              onClick={() => handleSearch(query)}
            >
              {" "}
              Abschicken
            </MDBBtn>
          </MDBCol>
        </MDBRow>

        {activeSearch && (
          <>
            <MDBRow>
              <h5 className="mt-3">
                Suche nach Aufträgen/Partnern, die folgenden Begriff enthalten:{" "}
                <i>{query}</i>
              </h5>
            </MDBRow>
            <Divider textAlign="left" className="mt-5 mb-4">
              <h5>Überblick über die Ergebnisse</h5>
            </Divider>
            <MDBBadge pill className="ms-3">
              {resultsPartnerships.length}
            </MDBBadge>
            <b> Partnerschaften</b>
            <MDBBadge pill className="ms-3">
              {resultsTransaction.length}
            </MDBBadge>
            <b> Aufträge</b>
            <Divider textAlign="left" className="mt-5 mb-4">
              <h5>Ergebnisse für Aufträge</h5>
            </Divider>
            <MDBRow>
              {resultsTransaction.map((transactionData) => (
                <React.Fragment>
                  <Transaction
                    key={transactionData.id}
                    id={transactionData.id}
                    title={transactionData.description}
                    added={transactionData.date_added}
                    exportAddress={transactionData.partnership.partner.name}
                    exportStreet={transactionData.partnership.partner.street}
                    exportCity={transactionData.partnership.partner.city}
                    exportCountry={
                      transactionData.partnership.partner.country_code
                    }
                    importAddress={transactionData.importAddress}
                    importStreet={transactionData.importStreet}
                    importCity={transactionData.importCity}
                    importCountry={transactionData.importCountry}
                    stakeholderCount={transactionData.stakeholderCount}
                    lastChange={transactionData.date_processed}
                    status={transactionData.status}
                    timestamp_added={transactionData.timestamp_added}
                    timestamp_processed={transactionData.timestamp_processed}
                    documentsData={documentsData}
                    declarationData={declarationData}
                  />
                  <br />
                </React.Fragment>
              ))}
              <Divider textAlign="left" className="mt-5 mb-4">
                <h5>Ergebnisse für Partnerschaften</h5>
              </Divider>
              {resultsPartnerships.map((partner) => (
                <React.Fragment>
                  <Partner
                    key={partner.partner.eori_nr}
                    id={partner.partner.eori_nr}
                    id_relation={partner.id}
                    title={partner.partner.name}
                    added={partner.date_added}
                    addressStreet={partner.partner.street}
                    addressCity={partner.partner.city}
                    addressCountry={partner.partner.country_code}
                    email={partner.partner.email}
                    phone={partner.partner.phone}
                    eori={partner.partner.eori_nr}
                  />
                  <br />
                </React.Fragment>
              ))}
              ;
            </MDBRow>
          </>
        )}
      </MDBContainer>
    </div>
  );
}

export default Search;
