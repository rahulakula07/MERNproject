import axios from "axios";

const axiosInstances=axios.create({
    baseURL: import.meta.mode === "development" ? "https://mernproject-neoe.onrender.com/api" : "/api",
    withCredentials:true,//send cookies to the server

})

export default axiosInstances