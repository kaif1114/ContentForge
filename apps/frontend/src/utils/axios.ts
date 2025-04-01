import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add type declaration for the custom flag
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}

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
  async (error) => {
    if(error.response?.status === 403){
      try {
        const refreshResponse = await api.get("/auth/refresh", {
          skipAuthRefresh: true
        });
        
        if (refreshResponse.status === 200) {
          const originalRequest = error.config;
          originalRequest.skipAuthRefresh = true;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access");
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status === 401 && !error.config.skipAuthRefresh) {
      localStorage.removeItem("access");
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export default api;
