import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CompanyForm() {
  const [eori_nr, setEoriNr] = useState("");
  const [street, setStreet] = useState("");
  const [city_code, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country_code, setCountry] = useState("");

  const axiosInstance = useAxiosPrivate();

  function handleSubmit(e) {
    e.preventDefault();
    const newCompany = {
      eori_nr,
      street,
      city_code,
      city,
      email,
      name,
      country_code,
    };

    //firma hinzufügen
    axiosInstance
      .post("/companies/", newCompany)
      .then(console.log())
      .catch((error) => {
        this.setState({ errorMessage: error.message });
        console.error("There was an error!", error);
      })
      .then(
        axiosInstance
          .post("/partnership/", { added_partner: eori_nr })
          .then(console.log())
          .catch((error) => {
            this.setState({ errorMessage: error.message });
            console.error("There was an error!", error);
          })
      );
    //firma als partner hinterlegen
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <MDBContainer>
          <MDBInput
            className="my-3"
            name="eori_nr"
            label="EORI-Nr."
            type="number"
            onChange={(e) => setEoriNr(e.target.value)}
          />
          <MDBInput
            className="mb-3"
            name="name"
            label="Name des Unternehmens"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <MDBRow>
            <MDBCol md="9">
              <MDBInput
                className="mb-3"
                name="street"
                label="Straße"
                type="text"
                onChange={(e) => setStreet(e.target.value)}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="4">
              <MDBInput
                className="mb-3"
                name="zipCode"
                label="PLZ"
                type="number"
                onChange={(e) => setZipCode(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="8">
              <MDBInput
                className="mb-3"
                name="city"
                label="Stadt"
                type="text"
                onChange={(e) => setCity(e.target.value)}
              />
            </MDBCol>
          </MDBRow>
          <MDBInput
            className="mb-3"
            name="country"
            label="Land"
            type="text"
            onChange={(e) => setCountry(e.target.value)}
          />
          <div className="d-grid mx-auto">
            <MDBBtn className="mt-3" type="submit" color="success">
              Hinzufügen
            </MDBBtn>
          </div>
        </MDBContainer>
      </form>
    </>
  );
}

export default CompanyForm;
