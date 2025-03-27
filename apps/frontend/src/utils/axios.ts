import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.withCredentials = true;
  config.headers["Content-Type"] = "application/json";
  return config;
},
    (error) => {
      return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => {
    const authHeader = response.headers.authorization || response.headers.Authorization 
    if (authHeader) {
      const token = authHeader.startsWith("Bearer ") ? 
        authHeader.substring(7) : authHeader;
      localStorage.setItem("access", token);
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("access");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
