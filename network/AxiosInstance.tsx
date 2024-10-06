import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export default AxiosInstance;