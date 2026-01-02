import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000", // your backend
// });
// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });
const API = axios.create({
  baseURL: "https://day-13.onrender.com",
  // withCredentials: true,
});

// axios.post(`${import.meta.env.VITE_API_URL}/auth/login`);


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
