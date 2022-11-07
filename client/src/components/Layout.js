import { Outlet } from "react-router-dom";
import React from "react";
import { useState } from "react";
import Footer from "./UI/Footer";
import SideNavigation from "./UI/SideNavigation";
import "./Layout.css";

import TopNavigation from "./UI/TopNavigation";
const Layout = () => {
  const [expandedNav, setExpandedNav] = useState(false);

  return (
    <React.Fragment>
      {/* Anpassung der TopNavigation Position an Sidebar State */}
      <div
        class="TopNavigation"
        style={{
          marginBottom: 54,
          marginLeft: expandedNav ? 240 : 64,
          padding: "0px 0px 0px 0px",
          transition: "0.2s",
        }}
      >
        <TopNavigation />
      </div>

      <SideNavigation
        expandedNav={expandedNav}
        setExpandedNav={setExpandedNav}
      />

      {/* Anpassung de Content Position an Sidebar State 
              (muss alle Routes einschließen) */}
      <div
        class="content"
        style={{
          marginLeft: expandedNav ? 240 : 64,
          padding: "0px 20px 70px 20px",
          transition: "0.2s",
          // minHeight: "90vh",
        }}
      >
        <main className="App">
          <Outlet />
        </main>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
