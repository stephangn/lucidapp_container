import React, { useEffect, useState } from "react";
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
  MDBDropdownHeader,
} from "mdb-react-ui-kit";

import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import NotificationToast from "../Dashboard/NotifcationToast";

export default function TopNavigation() {
  // Logout
  const { auth } = useAuth();
  const username = auth.username;
  const company = auth.company;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("company");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    //alert("Sie werden ausgeloggt.");
    navigate("/login", { replace: true });
    window.location.reload(false);
  };

  const [alerts, setAlerts] = useState([]);
  const [notificationsLoading, setNotificationLoading] = useState(true);

  const axiosInstance = useAxiosPrivate();

  // Suchen State
  const [searchTerm, setSearchTerm] = useState();

  // Notifications DB Call
  useEffect(() => {
    axiosInstance.get("/alerts?unread=true").then((res) => {
      setAlerts(res.data);
      setNotificationLoading(false);
    });
  }, []);

  // Search Submit
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/search?=${searchTerm}`, { replace: false });
  };

  return (
    <>
      <MDBNavbar
        style={{ marginLeft: 64 }}
        fixed="top"
        expand="lg"
        light
        bgColor="dark"
      >
        <MDBContainer fluid>
          <div className="d-flex flex-row">
            <form
              onSubmit={submitHandler}
              className="d-flex input-group w-auto"
            >
              <input
                style={{ width: 300 }}
                type="search"
                className="form-control"
                placeholder="Suchbegriff eingeben"
                aria-label="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to={`/search?=${searchTerm}`} className="btn btn-primary">
                Suchen
              </Link>
            </form>
          </div>
          <div className="d-flex flex-row">
            <MDBDropdown size="3" className="mx-2">
              {/* Anzahl Benachrichtungen */}
              <MDBDropdownToggle outline size="sm">
                <MDBIcon size="2x" className="ms-1" far icon="bell" />
              </MDBDropdownToggle>
              <MDBDropdownMenu
                className="p-3 text-muted overflow-scroll"
                style={{
                  width: "400px",
                  minHeight: "200px",
                  maxHeight: "400px",
                }}
              >
                <MDBDropdownItem>
                  <MDBDropdownHeader className="mb-2">
                    Benachrichtigungen
                  </MDBDropdownHeader>
                </MDBDropdownItem>
                <>
                  {alerts.length !== 0 && !notificationsLoading ? (
                    <>
                      {alerts.map((alert) => (
                        <MDBDropdownItem key={alert.id}>
                          <NotificationToast alert={alert} />
                        </MDBDropdownItem>
                      ))}
                    </>
                  ) : (
                    <>
                      <MDBDropdownItem className="mt-5 d-flex justify-content-center">
                        <p>Keinen neuen Benachrichtungen</p>
                      </MDBDropdownItem>
                    </>
                  )}
                </>
              </MDBDropdownMenu>
            </MDBDropdown>
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
                <MDBDropdownItem>
                  <MDBDropdownLink
                    onClick={() => {
                      navigate("/settings");
                    }}
                  >
                    <MDBIcon fas icon="cog" size="lg" className="me-2" />
                    Account
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
