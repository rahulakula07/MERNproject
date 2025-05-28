import axios from "axios";

const axiosInstances=axios.create({
    baseURL:"http://localhost:5000/api",
    withCredentials:true,//send cookies to the server
})

export default axiosInstances