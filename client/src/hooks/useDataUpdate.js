import axiosInstance from "../axiosApi"
import useAuth from "./useAuth"
import useAxiosPrivate from "./useAxiosPrivate";


const useDataUpdate = () => {
    const { setAuth } = useAuth();
    const axiosInstance = useAxiosPrivate();

    //Globale Nutzerdaten abfragen, die dann anwendungsweit zur Verfügung gestellt werden

    const dataUpdate = async() => {
        //console.log(`Neue Nutzerdaten werden angefordert`);
        const response = await axiosInstance.get('user')
        //console.log(response.data[0])
        //Unterscheiden wird Rollenbezogen für Zoll und Unternehmensmitarbeiter 
        if (response.data[0].role=="company_employee") {
            setAuth(prev => {
                return {
                    ...prev,
                    username: response.data[0].username,
                    company: response.data[0].employee?.company.name,
                    pubkey: response.data[0].employee?.company.publickey,
                    eori_nr: response.data[0].employee?.company.eori_nr,
                    role: response.data[0].role,
                    userData: response.data[0]
                }
            });
            return; 
        }
        setAuth(prev => {
            //console.log(`New Username received : ${response.data[0].username}`);
            return {
                ...prev,
                username: response.data[0].username,
                company: response.data[0].employee?.custom_office.name,
                pubkey: response.data[0].employee?.custom_office.publickey,
                eori_nr: response.data[0].employee?.custom_office.id,
                role: response.data[0].role
            }
        });
        return; 



    }
  return dataUpdate

}

export default useDataUpdate