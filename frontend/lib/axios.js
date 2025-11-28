//https://video-calling-psi-gules.vercel.app/api

import axios from 'axios';

// const BASE_URL = import.meta.env.MODE === 'development' ?  'http://localhost:5001/api' : 'https://video-calling-psi-gules.vercel.app/api' ;

const BASE_URL =import.meta.env.VITE_API_BASE_URL 

 
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,

});

