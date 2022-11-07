import React from "react";
import { MDBFooter } from "mdb-react-ui-kit";
import UniLogo from "../../Uni_Logo.png";
import Lucid from "../../LUCID.jpg";

function Footer() {
  return (
    <MDBFooter className="mt-3 text-center text-lg-left fixed-bottom">
      <div
        className="text-center p-3 "
        style={{
          backgroundColor: "#f1f1f1",
        }}
      >
        <img src={Lucid} className="me-4" style={{ width: "2rem" }} />{" "}
        <img src={UniLogo} className="me-4" style={{ width: "10rem" }} />{" "}
        <a
          className="text-dark"
          href="https://www.uni-goettingen.de/de/43876.html"
        >
          Professur für Anwendungssysteme und E-Business
        </a>
      </div>
    </MDBFooter>
  );
}

export default Footer;
