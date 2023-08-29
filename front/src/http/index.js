import axios from "axios";
import { toast } from "react-toastify";
import { fromStorage, isNull } from "../lib";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_PRO_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

http.interceptors.request.use(request => {
    const token = fromStorage('user_token')

    if(!isNull(token)) {
        request.headers = {
            ...request.headers,
            'Authorization': `Bearer ${token}`
        }
    }
    
    return request

}, error => Promise.reject(error))

http.interceptors.response.use(response => {
    if('data' in response && 'success' in response.data) {
        toast.success(response.data.success)
    }
    return response
}, error => {

    if('response' in error && 'data' in error.response && 'error' in error.response.data ){
    toast.error(error.response.data.error)
    }
    return Promise.reject(error)
})


export default http