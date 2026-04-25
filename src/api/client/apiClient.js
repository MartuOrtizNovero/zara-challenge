import axios from "axios";

const { VITE_API_BASE_URL, VITE_API_KEY } = import.meta.env;

const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": VITE_API_KEY,
  },
});

export default apiClient;
