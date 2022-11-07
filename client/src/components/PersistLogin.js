import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { MDBSpinner } from "mdb-react-ui-kit";
import useDataUpdate from "../hooks/useDataUpdate";
import "../pages/css/LoadingSpinner.css";

//Nutzer bleibt eingeloggt, sofern er sich nicht auslogt oder den Refresh Token im lokalen Speicher löscht 

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  const dataUpdate = useDataUpdate();

  useEffect(() => {
    let isMounted = true;

    //Sofern Nutzer zurückgekehrt werden Daten neu abgerufen 

    const verifyRefreshToken = async () => {
      //console.log("Verify Refresh token called");
      try {
        await dataUpdate();
        await refresh();
      } catch (err) {
        //console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  //Nur für Debugging und die Anzeige der aktuellen Status:

  /*     useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading]) */

  return (
    <>
      {isLoading ? (
        <div className="loadingSpinner">
          <MDBSpinner>
            <span className="visually-hidden">Lädt..</span>
          </MDBSpinner>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
