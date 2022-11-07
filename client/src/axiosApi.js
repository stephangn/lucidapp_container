import axios from "axios";


//const baseURL = "http://tradechain-app.herokuapp.com/";
const baseURL = "http://localhost:8000/";

/* Create standalone instance of axios that we can use every in the software*/
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1500000,
  headers: {
    /*Customize header to bearer*/
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export default axiosInstance;
