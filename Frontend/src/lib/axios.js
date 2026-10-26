import axios from "axios";

const axiosInstances = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "https://mernproject-f7fp.onrender.com/api",
    withCredentials: true, // send cookies to the server
});

export default axiosInstances