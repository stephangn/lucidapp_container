class AuthServices {
    logout() {
        localStorage.removeItem("username");
        localStorage.removeItem("company");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");
    }
}