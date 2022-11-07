import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosApi";
import useAuth from "../hooks/useAuth";
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";

import "./css/NotFound.css";
import UniLogo from "../Uni_Logo.png";
import Lucid from "../LUCID.jpg";

import { useNavigate, useLocation } from "react-router-dom";

const LOGIN_URL = "/api/token/";

export default function Login() {
  // -- Login --
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [sucess, setSucess] = useState(false);

  // --- Komponenten für Registrierung --//

  const [eori_nr, setEoriNr] = useState("");
  const [street, setStreet] = useState("");
  const [city_code, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [country_code, setCountry] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [publickey, setPubkey] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const accessToken = response?.data?.access;
      const roles = response?.data?.roles;
      const company = response?.data?.company;

      //Speichern der Daten für künftige Anfragen

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", response?.data?.refresh);
      //speichern von Nutzernamen und Firma im lokalen Speicher
      localStorage.setItem("username", response?.data?.user);
      localStorage.setItem("company", company);
      setAuth({ user, pwd, roles, company, accessToken });
      setUser("");
      setPwd("");
      setSucess(true);
      navigate("/", { replace: true });
      //navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Der Server antwortet nicht");
      } else if (err.response?.status === 400) {
        setErrMsg("Bitte alle Felder befüllen");
      } else if (err.response?.status === 401) {
        setErrMsg("Falsche Login-Daten");
      } else {
        setErrMsg("Allgemeiner Fehler");
      }
    }
  };

  //Funktion zum registrieren eines Mitarbeiters

  const registerEmployee = (e) => {
    // Check Formular Validierung
    var forms = document.getElementById("registerEmployeeForm");
    if (forms.checkValidity() == false) {
      console.log("Formular Eingabe inkorrekt.");
      return;
    }

    e.preventDefault();
    try {
      const response = axiosInstance.post("/registration/", {
        username: username,
        password: password,
        password2: password,
        company_id: eori_nr,
      });
      setRegisterEmployeeCorrect(true);
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg("Der Server antwortet nicht");
      } else if (err.response?.status === 400) {
        setErrMsg("Bitte alle Felder befüllen");
      } else if (err.response?.status === 401) {
        setErrMsg("Sie sind nicht berechtigt");
      } else {
        setErrMsg("Allgemeiner Fehler");
      }
    }
  };

  // Registrierung eines Unternehmens

  function registerCompany(e) {
    // Check Formular Validierung
    var forms = document.getElementById("registerForm");
    if (forms.checkValidity() == false) {
      console.log("Formular Eingabe inkorrekt.");
      return;
    }

    e.preventDefault();
    const newCompany = {
      eori_nr,
      street,
      city_code,
      city,
      email,
      name,
      country_code,
      phone,
      publickey,
    };

    //firma hinzufügen
    axiosInstance
      .post("/companies/", newCompany)
      .then((res) => {
        console.log(res.data);
        setRegisterCorrect(true);
      })
      .catch((error) => {
        setErrMsg(error.message);
        //this.setState({ errorMessage: error.message });
        console.error("There was an error!", error);
      })
      .then(registerEmployee(e));
    //firma als partner hinterlegen
  }

  // Validierung
  const [registerCorrect, setRegisterCorrect] = useState(false);
  const [registerEmployeeCorrect, setRegisterEmployeeCorrect] = useState(false);

  // -- Tab-Steuerung --
  // State über aktiven Tab
  const [fillActive, setFillActive] = useState("login");

  // Funktion zum wechseln des Tabs
  function handleFillClick(value) {
    if (value === fillActive) {
      return;
    }

    setFillActive(value);
  }

  return (
    <>
      <div style={{ width: "26rem" }} className="text-middle">
        <img src={Lucid} style={{ width: "6rem" }} className="mb-5" />
        <img src={UniLogo} style={{ width: "26rem" }} className="mb-5" />
        {sucess ? (
          <section>
            <h1> Du bist eingeloggt</h1>
            <br />
            <p>
              <a href="#">Zur Startseite</a>
            </p>
          </section>
        ) : (
          <section>
            <MDBTabs pills justify className="mb-3">
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => handleFillClick("login")}
                  active={fillActive === "login"}
                >
                  Login
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => handleFillClick("register_company")}
                  active={
                    fillActive === "register_employee" ||
                    fillActive === "register_company"
                  }
                >
                  Registrieren
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
              <MDBTabsPane show={fillActive === "login"}>
                <form onSubmit={handleLogin}>
                  <br />
                  <MDBInput
                    className="mb-4"
                    type="username"
                    id="username"
                    name="username"
                    label="Nutzername"
                    onChange={(e) => setUser(e.target.value)}
                  />
                  <MDBInput
                    className="mb-4"
                    type="password"
                    id="password"
                    name="password"
                    label="Passwort"
                    onChange={(e) => setPwd(e.target.value)}
                  />

                  <br />

                  <MDBBtn type="submit" className="mb-4" block>
                    Einloggen
                  </MDBBtn>

                  <div className="text-center">
                    <p>
                      Noch nicht Mitglied?{" "}
                      <a
                        href="javascript:;"
                        onClick={() => handleFillClick("register_company")}
                      >
                        Registrieren
                      </a>
                    </p>
                  </div>
                </form>
                <p
                  className={errMsg ? "errmsg alert alert-danger" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
              </MDBTabsPane>
              <MDBTabsPane show={fillActive === "register_company"}>
                <form id="registerForm" onSubmit={(e) => e.preventDefault()}>
                  <MDBInput
                    className="mb-4"
                    id="name_firma"
                    label="Name des Unternehmens"
                    type="text"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                  <MDBInput
                    className="mb-4"
                    id="eori"
                    type="number"
                    label="EORI-Nr."
                    required
                    onChange={(e) => setEoriNr(e.target.value)}
                  />
                  <MDBInput
                    className="mb-4"
                    id="strasse"
                    label="Straße u. Nr."
                    type="text"
                    required
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <MDBRow>
                    <MDBCol className="col-4">
                      <MDBInput
                        className="mb-4"
                        type="number"
                        id="plz"
                        label="PLZ"
                        required
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        className="mb-4"
                        id="stadt"
                        label="Stadt"
                        type="text"
                        required
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    className="mb-5"
                    id="land"
                    label="Land"
                    type="text"
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <MDBInput
                    className="mb-4"
                    autocomplete="off"
                    id="email"
                    label="E-Mail Adresse"
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <MDBInput
                    className="mb-5"
                    id="telefon"
                    label="Telefonnr."
                    type="text"
                    required
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <MDBInput
                    className="mb-5"
                    id="publickey"
                    label="Blockchain Publickey"
                    type="number"
                    required
                    onChange={(e) => setPubkey(e.target.value)}
                  />

                  <hr className="mb-5" />
                  <MDBInput
                    className="mb-4"
                    id="mitarbeiter"
                    label="Name des Mitarbeiters"
                    type="text"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <MDBInput
                    className="mb-4"
                    id="passwort"
                    type="password"
                    label="Passwort"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <MDBBtn
                    type="submit"
                    onClick={registerCompany}
                    className="mb-4"
                    block
                  >
                    Registrieren
                  </MDBBtn>
                  {registerCorrect && (
                    <p
                      className="errmsg alert alert-success"
                      aria-live="assertive"
                    >
                      Registrierung erfolgreich. Sie können sich jetzt
                      einloggen.
                    </p>
                  )}

                  <div className="text-center">
                    <p>
                      Unternehmen ist bereits im System?{" "}
                      <a
                        href="javascript:;"
                        onClick={() => handleFillClick("register_employee")}
                      >
                        <br />
                        Mitarbeiter registrieren
                      </a>
                    </p>
                  </div>
                </form>
              </MDBTabsPane>
              <MDBTabsPane show={fillActive === "register_employee"}>
                <form
                  id="registerEmployeeForm"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <MDBInput
                    className="mb-4"
                    id="eori"
                    type="number"
                    label="EORI-Nr. des Unternehmens"
                    required
                    onChange={(e) => setEoriNr(e.target.value)}
                  />
                  <MDBInput
                    className="mb-5"
                    id="name_firma"
                    label="Name des Mitarbeiters"
                    type="text"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <MDBInput
                    className="mb-4"
                    id="passwort"
                    type="password"
                    label="Passwort"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <MDBBtn
                    type="submit"
                    onClick={registerEmployee}
                    className="mb-4"
                    block
                  >
                    Registrieren
                  </MDBBtn>
                  {registerEmployeeCorrect && (
                    <p
                      className="errmsg alert alert-success"
                      aria-live="assertive"
                    >
                      Registrierung erfolgreich. Sie können sich jetzt
                      einloggen.
                    </p>
                  )}
                  <div className="text-center">
                    <p>
                      Unternehmen ist noch nicht im System?{" "}
                      <a
                        href="javascript:;"
                        onClick={() => handleFillClick("register_company")}
                      >
                        <br />
                        Unternehmen registrieren
                      </a>
                    </p>
                  </div>
                </form>
              </MDBTabsPane>
            </MDBTabsContent>
          </section>
        )}
      </div>
    </>
  );
}
