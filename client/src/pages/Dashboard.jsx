import React, { useEffect, useState } from "react";
import "./css/LoadingSpinner.css";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCardHeader,
  MDBRow,
  MDBCol,
  MDBSpinner,
} from "mdb-react-ui-kit";

import useAuth from "../hooks/useAuth";

import DashboardDocumentCard from "../components/Dashboard/DashboardDocumentCard";
import axiosInstance from "../axiosApi";
import { Link } from "react-router-dom";
import NotificationToast from "../components/Dashboard/NotifcationToast";

function Dashboard() {
  // Transaktionen
  const [transactionsData, setTransactionsData] = useState([]);

  // Dokumente
  const [documentsData, setDocumentsData] = useState([]);

  const [openRequests, setopenRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const { auth } = useAuth();

  // DB Call
  async function getDashboardData() {
    //Abfragen der Transaktionen
    await axiosInstance
      .get("transactions/")
      .then((res) => {
        setTransactionsData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //Abfragen der Dokumente
    await axiosInstance
      .get("documents/")
      .then((res) => {
        setDocumentsData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    //Abfragen der unbestätigten Partnerschaften bei denen wir Partner 2 sind

    await axiosInstance
      .get(`partnership/?partner2=${auth.eori_nr}&confirmed=false`)
      .then((res) => {
        setopenRequests(res.data);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });
    await axiosInstance
      .get(`/alerts?unread=true`)
      .then((res) => {
        setAlerts(res.data);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });
    setIsLoading(false);
  }

  // Transaktionen abrufen
  useEffect(() => {
    getDashboardData();
  }, []);

  // Dokumente abrufen
  useEffect(() => {
    axiosInstance.get("documents/").then((res) => {
      setDocumentsData(res.data);
    });
  }, []);

  const [alerts, setAlerts] = useState([]);

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
            <h3>Dashboard</h3>
            <br />
            <MDBRow>
              <MDBCol className="col-md-6 mb-4">
                <MDBCard style={{ height: "500px" }}>
                  <MDBCardHeader style={{ background: "#fbfbfb" }}>
                    <b>Benachrichtigungen</b>
                  </MDBCardHeader>
                  <MDBCardBody className="overflow-scroll">
                    <MDBCardText>
                      <>
                        {alerts.length !== 0 ? (
                          <>
                            {alerts.map((alert) => (
                              <NotificationToast key={alert.id} alert={alert} />
                            ))}
                          </>
                        ) : (
                          <MDBCardTitle className="mt-5">
                            Keine neuen Benachrichtungen
                          </MDBCardTitle>
                        )}
                      </>
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol className="col-md-6 mb-4">
                <MDBCard style={{ height: "240px", marginBottom: "20px" }}>
                  <MDBCardHeader style={{ background: "#fbfbfb" }}>
                    <b>Anzahl aktiver Aufträge: </b> {transactionsData.length}
                  </MDBCardHeader>
                  <MDBCardBody>
                    {transactionsData !== [] ? (
                      <>
                        <i>Zuletzt aktualisiert:</i>
                        <MDBCardTitle>
                          {transactionsData[0].description}
                        </MDBCardTitle>
                        <MDBCardText>
                          {transactionsData[0].partnership.partner.name}
                          <br />
                          {transactionsData[0].partnership.partner.street}{" "}
                          <br />
                          {
                            transactionsData[0].partnership.partner.city_code
                          }{" "}
                          {transactionsData[0].partnership.partner.city},{" "}
                          {transactionsData[0].partnership.partner.country_code}{" "}
                          <Link
                            style={{}}
                            to={
                              "/transactions/" +
                              transactionsData[0].id.toString()
                            }
                            key={transactionsData[0].id}
                          >
                            <MDBBtn outline className="float-end">
                              Zum Auftrag
                            </MDBBtn>
                          </Link>
                        </MDBCardText>
                      </>
                    ) : (
                      <MDBCardTitle className="mt-5">
                        Keine neuen Anfragen
                      </MDBCardTitle>
                    )}
                  </MDBCardBody>
                </MDBCard>

                <MDBCard style={{ height: "240px" }}>
                  <MDBCardHeader style={{ background: "#fbfbfb" }}>
                    <b>Ausstehende Partneranfragen: </b> {openRequests.length}
                  </MDBCardHeader>
                  <MDBCardBody>
                    {openRequests.length != 0 ? (
                      <>
                        <i>Neuste Anfrage:</i>
                        <MDBCardTitle>
                          {openRequests[0].partner.name}
                        </MDBCardTitle>
                        <MDBCardText>
                          EORI: {openRequests[0].partner.eori_nr}
                          <br />
                          Anfragedatum: {openRequests[0].date_added}
                          <div className="float-end">
                            <Link
                              style={{ display: "block", margin: "1rem 0" }}
                              to={"/partners/"}
                            >
                              <MDBBtn outline className="float-end">
                                Zur Partnerübersicht
                              </MDBBtn>
                            </Link>
                          </div>
                        </MDBCardText>
                      </>
                    ) : (
                      <MDBCardTitle className="mt-5">
                        Keine neuen Anfragen
                      </MDBCardTitle>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <MDBCard>
                  <MDBCardHeader style={{ background: "#fbfbfb" }}>
                    <b>Zuletzt hinzugefügte Dokumente</b>
                  </MDBCardHeader>
                  <MDBCardBody>
                    <MDBCardText>
                      {documentsData !== [] ? (
                        <MDBRow className="d-flex justify-content-center">
                          {documentsData.slice(0, 3).map((document) => (
                            <React.Fragment key={document.id}>
                              <DashboardDocumentCard document={document} />
                              <br />
                            </React.Fragment>
                          ))}
                        </MDBRow>
                      ) : (
                        <MDBRow>
                          <p>Es liegen noch keine Dokumente vor.</p>
                        </MDBRow>
                      )}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      )}
    </>
  );
}

export default Dashboard;
