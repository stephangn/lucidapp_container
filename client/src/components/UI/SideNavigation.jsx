import React, { useEffect, useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";

import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";

import "../../pages/css/react-sidenav.css";
import { useNavigate, useLocation } from "react-router-dom";

function SideNavigation(props) {
  let navigate = useNavigate();
  let location = useLocation();

  return (
    <SideNav
      onToggle={() => props.setExpandedNav(!props.expandedNav)}
      style={{
        padding: "0px 0px 0px 0px",
        position: "fixed",
      }}
    >
      <SideNav.Toggle />

      <SideNav.Nav defaultSelected="dashboard">
        <NavItem
          // eventKey="dashboard"
          active={location.pathname.includes("/dashboard")}
          onSelect={() => navigate("/dashboard", { replace: false })}
        >
          <NavIcon>
            <MDBIcon fas icon="tachometer-alt" style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText>Dashboard</NavText>
        </NavItem>
        <NavItem
          // eventKey="transactions"
          active={location.pathname.includes("/transactions")}
          onSelect={() => navigate("/transactions", { replace: false })}
        >
          <NavIcon>
            <MDBIcon fas icon="box" style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText>Aufträge</NavText>
        </NavItem>
        <NavItem
          // eventKey="partners"
          active={location.pathname.includes("/partners")}
          onSelect={() => navigate("/partners", { replace: false })}
        >
          <NavIcon>
            <MDBIcon fas icon="address-book" style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText>Partner</NavText>
        </NavItem>
        <NavItem
          // eventKey="settings"
          active={location.pathname.includes("/settings")}
          onSelect={() => navigate("/settings", { replace: false })}
        >
          <NavIcon>
            <MDBIcon fas icon="cog" style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText>Einstellungen</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
}

export default SideNavigation;
