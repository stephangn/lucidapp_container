import React, { useEffect, useState } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBSpinner,
  MDBIcon,
} from "mdb-react-ui-kit";
import { Accordion } from "react-bootstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

export default function PartnerRequests(props) {
  const axiosInstance = useAxiosPrivate();
  const { auth } = useAuth();

  const [openRequests, setopenRequests] = useState();

  const [userCompanyEORI, setUserCompanyEORI] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserCompanyEORI(auth.eori_nr);
  }, [auth]);

  useEffect(async () => {
    await axiosInstance
      .get(`partnership/?partner2=${userCompanyEORI}&confirmed=false`)
      .then((res) => {
        setopenRequests(res.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        if (error.response) {
/*           // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers); */
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error", error.message);
        }
      });
  }, [userCompanyEORI, props.reload]);

  function handleDelete() {}

  function handleAccept(partnership_id) {
    axiosInstance
      .patch(`partnership/${partnership_id}/`, { confirmed: true })
      .then((res) => {
        props.setReload();
      });
    props.setSnackbarSuccess(true);
    props.setSnackbarMessage("Partneranfrage angenommen.");
    props.handleOpenSnackbar();
    props.setNewPartner(!props.newPartner);
    return;
  }

  return (
    <>
      {isLoading ? (
        <div className="text-center">
          <MDBSpinner>
            <span className="visually-hidden">Lädt..</span>
          </MDBSpinner>
        </div>
      ) : (
        // Akkordian automatisch geöffnet wenn min. 1 Partneranfrage:
        <Accordion defaultActiveKey={openRequests.length !== 0 ? "0" : "1"}>
          {/* // Akkordion öffnet nicht automatisch:
        // <Accordion defaultActiveKey="1"> */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Ausstehende Partneranfragen (<b>{openRequests.length}</b>)
            </Accordion.Header>
            <Accordion.Body>
              {openRequests.length == 0 ? (
                "Es liegen keine Anfragen vor."
              ) : (
                <MDBTable responsive className="align-middle">
                  <MDBTableHead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Unternehmen</th>
                      <th scope="col">EORI-Nr.</th>
                      <th scope="col">Anfragedatum</th>
                      <th scope="col"></th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {openRequests.map((openRequests, index) => (
                      <tr key={index}>
                        <th scope="row">
                          <div className="">{index + 1}</div>
                        </th>
                        <td>
                          <div className="">{openRequests.partner.name}</div>
                        </td>
                        <td>
                          <div className="">{openRequests.partner.eori_nr}</div>
                        </td>
                        <td>
                          <div className="">{openRequests.date_added}</div>
                        </td>
                        <td>
                          <div className="float-end">
                            <MDBBtn
                              color="success"
                              outline
                              rounded
                              onClick={() => handleAccept(openRequests.id)}
                            >
                              <MDBIcon size="lg" fas icon="check" />
                            </MDBBtn>
                            <MDBBtn
                              color="danger mx-2"
                              className=""
                              outline
                              rounded
                              onClick={() => handleDelete(openRequests.id)}
                            >
                              <MDBIcon size="lg" fas icon="times" />
                            </MDBBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </MDBTableBody>
                </MDBTable>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  );
}
