import axios from 'axios';

// API temel URL'si
const API_BASE_URL = 'https://localhost:7299/api'; // Backend temel adresi

const api = axios.create({
    baseURL: API_BASE_URL, // Tüm istekler bu temel URL üzerinden yapılır
    headers: {
        'Content-Type': 'application/json', // İsteklerin JSON formatında olduğunu belirtiyoruz
    },
});

export default api;

