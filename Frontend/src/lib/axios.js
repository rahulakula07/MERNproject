import axios from "axios";

const axiosInstances=axios.create({
    baseURL:"https://mernproject-neoe.onrender.com/api",
    withCredentials:true,//send cookies to the server
})

export default axiosInstances