import axiosInstance from "../axiosApi";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";



//Handler für API Anfragen der Bedarf mittels Interceptor zum Beispiel neuen Acces Token anfragen, den Nutzer zur Anmeldeseite leitet (wenn er nicht mehr eingelogt ist
//oder die Anfrage durchleitet. 

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();


    useEffect(() => {
        //console.log(auth);

        //Wenn kein Token vorhanden ist wird neuer Token erzeugt und gespeichert
        const requestIntercept = axiosInstance.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    //console.log("Alternativer Header wird erzeugt");
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        ); 
        const responseIntercept = axiosInstance.interceptors.response.use(
            //Antwort weiterleiten wenn alles okay 
            response => response,
            //fehler abfangen und vorherige Anfrage einlesen
            async (error) => {
                //console.log("Fehler in der Anfrage")
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(prevRequest); 
                }
                return Promise.reject(error);
            }
            
        );
        //console.log('interceptors ausgeführt')
        //Cleanup -> um schleifen zu vermeiden 
        return() => {
            axiosInstance.interceptors.request.eject(requestIntercept)
            axiosInstance.interceptors.response.eject(responseIntercept)

        }
    }, [auth,refresh])
    //zurückgeben des Axios Call mit Interceptor
    return axiosInstance

}

export default useAxiosPrivate