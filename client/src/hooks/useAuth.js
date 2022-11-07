import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

//Liefert anwendungsweit Nutzerdaten mithilfe der AuthContext Methode
const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;  