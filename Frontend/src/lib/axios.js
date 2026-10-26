import axios from "axios";

const axiosInstances = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api"),
    withCredentials: true, // send cookies to the server
});

export default axiosInstances