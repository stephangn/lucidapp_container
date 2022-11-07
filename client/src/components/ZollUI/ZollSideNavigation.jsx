import React from "react";
import { MDBIcon } from "mdb-react-ui-kit";

import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";

import "../../pages/css/react-sidenav.css";
import { useNavigate } from "react-router-dom";

function ZollSideNavigation(props) {
  let navigate = useNavigate();

  return (
    <SideNav
      onToggle={() => props.setExpandedNav(!props.expandedNav)}
      style={{
        padding: "0px 0px 0px 0px",
        position: "fixed",
      }}
    >
      <SideNav.Toggle />

      <SideNav.Nav defaultSelected="transactions">
        <NavItem
          eventKey="dashboard"
          onSelect={() => navigate("/dashboard", { replace: true })}
        >
          <NavIcon>
            <MDBIcon fas icon="tachometer-alt" style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText>Dashboard</NavText>
        </NavItem>
        <NavItem
          eventKey="transactions"
          onSelect={() => navigate("/transactions", { replace: true })}
        >
          <NavIcon>
            <MDBIcon fas icon="box" style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText>Aufträge</NavText>
        </NavItem>
        <NavItem
          eventKey="settings"
          onSelect={() => navigate("/transactions", { replace: true })}
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

export default ZollSideNavigation;
