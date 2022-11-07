import React, { useState, useEffect } from "react";
import { MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import "../css/LoadingSpinner.css";

import ZollTransaction from "../../components/ZollTransactions/ZollTransaction";

import Form from "react-bootstrap/Form";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import useAuth from "../../hooks/useAuth";

function ZollTransactions() {
  const [transactionsData, setTransactionsData] = useState([]);
  const [reload, setreload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { auth } = useAuth();

  const axiosInstance = useAxiosPrivate();

  // DB Call
  useEffect(async () => {
    await axiosInstance
      .get("declaration_auth/?customs_office=" + auth.eori_nr)
      .then((res) => {
        setTransactionsData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  }, [reload]);

  // Sortieralgorithmen
  function sortDescriptionAsc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.description > b.description ? -1 : 1));

    setTransactionsData(myData);
  }

  function sortDescriptionDesc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.description > b.description ? 1 : -1));

    setTransactionsData(myData);
  }

  function sortDateAddedAsc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.date_added > b.date_added ? 1 : -1));

    setTransactionsData(myData);
  }

  function sortDateAddedDesc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.date_added > b.date_added ? -1 : 1));

    setTransactionsData(myData);
  }

  function sortDateUpdatedAsc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.date_processed > b.date_processed ? 1 : -1));

    setTransactionsData(myData);
  }

  function sortDateUpdatedDesc() {
    const myData = []
      .concat(transactionsData)
      .sort((a, b) => (a.date_processed > b.date_processed ? -1 : 1));

    setTransactionsData(myData);
  }

  function sortTransactions(event) {
    if (event.target.value === "DescriptionAsc") {
      sortDescriptionAsc();
      return;
    }
    if (event.target.value === "DescriptionDesc") {
      sortDescriptionDesc();
      return;
    }
    if (event.target.value === "UpdatedAsc") {
      sortDateUpdatedAsc();
      return;
    }
    if (event.target.value === "UpdatedDesc") {
      sortDateUpdatedDesc();
      return;
    }
    if (event.target.value === "AddedAsc") {
      sortDateAddedAsc();
      return;
    }
    if (event.target.value === "AddedDesc") {
      sortDateAddedDesc();
      return;
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="loadingSpinner">
          <MDBSpinner>
            <span className="visually-hidden">Lädt..</span>
          </MDBSpinner>
        </div>
      ) : (
        <div>
          <MDBContainer>
            <h3>Zollanmeldungen</h3>

            <nav className="my-3 navbar navbar-expand-lg navbar-light bg-light">
              <MDBContainer>
                <Form.Select
                  style={{
                    minWidth: 250,
                    maxWidth: 250,
                  }}
                  onChange={(event) => sortTransactions(event)}
                >
                  <option value={"UpdatedDesc"}>
                    Zuletzt geändert absteigend
                  </option>
                  <option value={"UpdatedAsc"}>
                    Zuletzt geändert aufsteigend
                  </option>
                  <option value={"DescriptionDesc"}>
                    Beschreibung absteigend
                  </option>
                  <option value={"DescriptionAsc"}>
                    Beschreibung aufsteigend
                  </option>
                  <option value={"AddedDesc"}>Hinzugefügt am absteigend</option>
                  <option value={"AddedAsc"}>Hinzugefügt am aufsteigend</option>
                </Form.Select>{" "}
                <div className="me-3">
                  <b>{transactionsData.length} Anmeldungen</b>
                </div>
              </MDBContainer>
            </nav>
            {transactionsData.map((transactionData) => (
              <React.Fragment>
                <ZollTransaction
                  key={transactionData.id}
                  id={transactionData.id}
                  title={transactionData?.transaction.description}
                  added={transactionData?.transaction.date_added}
                  exportAddress={transactionData?.exporteur.name}
                  exportStreet={transactionData?.exporteur.street}
                  exportCity={transactionData?.exporteur.city}
                  exportCountry={transactionData?.exporteur.country_code}
                  importName={transactionData?.importeur.name}
                  importStreet={transactionData?.importeur.street}
                  importCity={transactionData?.importeur.city}
                  importCountry={transactionData?.importeur.country_code}
                  declarationData={transactionData}
                  stakeholderCount={transactionData?.stakeholderCount}
                  lastChange={transactionData?.transaction.date_processed}
                />
                <br />
              </React.Fragment>
            ))}
          </MDBContainer>
        </div>
      )}
    </>
  );
}

export default ZollTransactions;
