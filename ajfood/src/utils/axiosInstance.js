import axios from "axios";

const API_BASE_URL = "https://ajfoods.onrender.com/api";

const axiosInstance = axios.create({
    baseURL:API_BASE_URL,
    withCredentials:true,
})

axiosInstance.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},
(error)=>Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        if(error.response&&error.response.status === 401){
            try {
                const refreshResponse = await axios.put(`${API_BASE_URL}/refresh-token`,{},
                { withCredentials: true}
            )
            const newToken = refreshResponse.data.accessToken;
            localStorage.setItem("token",newToken)
            error.config.headers.Authorization = `Bearer ${newToken}`
            return axiosInstance(error.config);
            } catch (refreshError) {
               localStorage.removeItem("token");
               window.location.href = "/login";
               return Promise.reject(refreshError); 
            }
        }
        return Promise.reject(error);
    }
)
export default axiosInstance;