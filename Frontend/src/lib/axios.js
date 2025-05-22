import axios from "axios";

const axiosInstances=axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials:true,//send cookies to the server

})

export default axiosInstances