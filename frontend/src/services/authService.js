import api from "./api";

const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    const loginData = response.data.data;

    localStorage.setItem("token", loginData.token);
    localStorage.setItem("user", JSON.stringify(loginData));

    return loginData;
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

const getToken = () => {
    return localStorage.getItem("token");
};

const getUser = () => {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
};

const isLoggedIn = () => {
    return !!localStorage.getItem("token");
};

const authService = {
    login,
    logout,
    getToken,
    getUser,
    isLoggedIn,
};

export default authService;