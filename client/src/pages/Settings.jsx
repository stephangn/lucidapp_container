import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Settings() {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPassword2, setNewPassword2] = useState();

  const axiosInstance = useAxiosPrivate();

  //Abfragen der Nutzerdaten aus Authentifizierungscontext
  const { auth } = useAuth();

  const [passwordError, setPasswordError] = useState(null);

  function handlePasswordSubmit(event) {
    event.preventDefault();

    // Validierung
    if (oldPassword == "" || oldPassword == null) {
      setPasswordError("Aktuelles Passwort eingeben.");
      return;
    }
    if (newPassword == "" || newPassword == null) {
      setPasswordError("Neues Passwort eingeben.");
      return;
    }
    if (newPassword == "" || newPassword == null) {
      setPasswordError("Neues Passwort wiederholen.");
      return;
    }
    if (newPassword !== newPassword2) {
      setPasswordError("Neue Passwörter stimmen nicht überein.");
      return;
    }

    // Neues Passwort "newPassword" zum Passwort machen:
    // POST-Request
    axiosInstance
      .patch("/change_password/" + auth.userData?.id + "/", {
        password: newPassword,
        password2: newPassword2,
        oldPassword: oldPassword,
      })
      .then((res) => {
        setPasswordError("Neues Passwort erfolgreich angelegt.");
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <MDBContainer>
        <h3>Benutzer-Account</h3>
        <br />
        <MDBRow className="mb-2">
          <MDBCol sm="6">
            <h4 className="mb-3">Accountinformationen</h4>
            <h5>Unternehmen</h5>
            <p>
              <b>Name des Unternehmens: </b>
              <br />
              {auth.userData?.employee.company.name}
            </p>
            <p>
              <b>EORI-Nr.: </b>
              <br />
              {auth.userData?.employee.company.eori_nr}
            </p>
            <p>
              <b>Straße u. Hausnr.: </b>
              <br />
              {auth.userData?.employee.company.street}
            </p>
            <p>
              <b>PLZ: </b>
              <br />
              {auth.userData?.employee.company.city_code}
            </p>
            <p>
              <b>Stadt: </b>
              <br />
              {auth.userData?.employee.company.city}
            </p>
            <p>
              <b>Land: </b>
              <br />
              {auth.userData?.employee.company.country_code}
            </p>
            <p>
              <b>E-Mail Adresse: </b>
              <br />
              {auth.userData?.employee.company.email}
            </p>
            <p>
              <b>Telefonnr.: </b>
              <br />
              {auth.userData?.employee.company.phone}
            </p>
            <hr className="my-4" />
            <h5>Eigenes Mitarbeiter-Konto</h5>
            <p>
              <b>Account-Name: </b>
              <br />
              {auth.username}
            </p>
          </MDBCol>
          <MDBCol sm="6">
            <h4 className="mb-3">Passwort aktualisieren</h4>
            <form onSubmit={handlePasswordSubmit} style={{ width: "300px" }}>
              <MDBInput
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autocomplete="new-password"
                className="mb-4"
                type="Password"
                id="newPassword"
                name="newPassword"
                label="Aktuelles Passwort"
              />
              <MDBInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autocomplete="new-password"
                className="mb-3"
                type="Password"
                id="oldPassword"
                name="oldPassword"
                label="Neues Passwort"
              />
              <MDBInput
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                autocomplete="new-password"
                className="mb-4"
                type="Password"
                id="oldPassword2"
                name="oldPassword2"
                label="Neues Passwort wiederholen"
              />

              <MDBBtn block type="submit" className="mb-4">
                Passwort aktualisieren
              </MDBBtn>
              {passwordError == "Neues Passwort erfolgreich angelegt." ? (
                <div className="alert alert-success" role="alert">
                  {passwordError}
                </div>
              ) : passwordError !== null ? (
                <div className="alert alert-danger" role="alert">
                  {passwordError}
                </div>
              ) : null}
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Settings;
