import  { useLocation, Navigate,Outlet} from "react-router-dom";
import { useState, useEffect } from "react";

import { MDBSpinner } from "mdb-react-ui-kit";

import useAuth from "../hooks/useAuth";
import useDataUpdate from "../hooks/useDataUpdate";


//Management der gesperrten Nutzerbereiche und zur Verfügung stellen einer Komponente die die Berechtigungen prüfen 

const RequireAuth =  ({allowedRoles}) => {
    const {auth} = useAuth();
    const location = useLocation();
    const dataUpdate = useDataUpdate(); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        let isMounted = true; 
        //Nutzerdaten müssen beim erstmaligen Login abgefragt werden bzw. aktualisiert werden, damit Rollen zur Verfügung stehen

        const getfirstDataSet = async () => {
            try {
                await dataUpdate();
            }        
            catch (err) {
                console.error(err);
            }
            finally{
                isMounted && setIsLoading(false);
            }
        }

        !auth?.role?  getfirstDataSet() : setIsLoading(false);

        return () => isMounted = false;
    }, [])


/*     console.log(auth?.user);
    console.log(`Die aktuelle Rolle ist ${auth?.role}`)
    console.log(allowedRoles) */
    
    return (
        
        isLoading
            ?   <MDBSpinner grow>
                    <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
                : 
        //wenn AccessToken vorhanden Seite anzeigen, ansonsten login
                allowedRoles?.includes( auth?.role)
                        ? <Outlet/> 
                        : auth?.username 
                            ? <Navigate to="/unauthorized" state={{from:location}} replace />
                            : <Navigate to = "/login" state={{from:location}} replace />
        
    )

}

export default RequireAuth;