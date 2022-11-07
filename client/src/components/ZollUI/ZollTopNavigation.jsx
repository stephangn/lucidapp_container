import React from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBDropdownDivider,
  MDBNavbarBrand,
} from "mdb-react-ui-kit";

import Lucid from "../../LUCID.jpg";

import useAuth from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";

export default function TopNavigation() {
  // Logout Funktion
  const { auth } = useAuth();
  const username = auth.username;
  const company = auth.company;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("company");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
    window.location.reload(false);
  };

  return (
    <>
      <MDBNavbar
        style={{ marginLeft: 0 }}
        fixed="top"
        expand="lg"
        light
        bgColor="dark"
      >
        <MDBContainer fluid>
          <div className="d-flex flex-row">
            <MDBNavbarBrand
              light
              href="/zoll/declarations"
              style={{ color: "#ffffff" }}
            >
              <img
                className="me-3"
                src={Lucid}
                height="40"
                alt=""
                loading="lazy"
              />
              LUCID - {company}
            </MDBNavbarBrand>
          </div>
          <div className="d-flex flex-row">
            <MDBDropdown>
              <MDBDropdownToggle outline size="sm">
                <MDBIcon size="2x" className="ms-1" far icon="user-circle" />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-muted">
                <p className="mt-3 mx-3">
                  <b>Organisation: </b>
                  {company}
                </p>
                <p className="mt-3 ms-3">
                  <b>Mitarbeiter: </b>
                  {username}
                </p>
                <MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownDivider />
                  </MDBDropdownItem>
                  <MDBDropdownLink onClick={logout}>
                    <MDBIcon
                      fas
                      icon="sign-out-alt"
                      size="lg"
                      className="me-2"
                    />
                    Logout
                  </MDBDropdownLink>
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
        </MDBContainer>
      </MDBNavbar>
      <br />
    </>
  );
}
