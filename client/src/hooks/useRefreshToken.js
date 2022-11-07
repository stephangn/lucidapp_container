import axiosInstance from "../axiosApi"
import useAuth from "./useAuth"

//Anfragen eines neuen Access Token mithilfe des im lokalen Speicher beim Mithilfe des abgelegtens Refresh Token

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refreshToken = localStorage.getItem("refresh_token");
    const refresh = async() => {
        //console.log(`Neuer Access token wird angefordert. Genutzter Refresh Token ${refreshToken}`);
                    //Refresh Token an Server für neuen Access Token

        const response = await axiosInstance.post('/api/token/refresh/', 
            JSON.stringify({refresh: refreshToken}),
        );
    
        setAuth(prev => {
            //console.log(JSON.stringify(prev));
            //console.log(`New AccessToken received : ${response.data.access}`);
            return {
                ...prev,


                accessToken: response.data.access
            }
        });
        return response.data.access; 
    }
  return refresh

}

export default useRefreshToken