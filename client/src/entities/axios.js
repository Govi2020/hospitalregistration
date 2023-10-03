import axios from "axios";

let backend = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default backend;
