import React from "react";
import "./css/NotFound.css";

import useAuth from "../hooks/useAuth";

function Unauthorized() {
  //Debugging
  const { auth } = useAuth();

  return (
    <div class="text-middle">
      <h1>Keine Berechtigung</h1>
      <h3>
        Dieser Bereich ist für den aktuell angemeldeten Nutzertyp "{auth.role}"
        nicht verfügbar
      </h3>
    </div>
  );
}

export default Unauthorized;
