import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Injecter le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token automatique si 401
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh,
        });
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/connexion";
      }
    }
    return Promise.reject(error)
  },
);

// ── Auth ──────────────────────────────────────────

export const authService = {
    login:    (data) => api.post('/token/', data),
    register: (data) => api.post('/compte/user/', data),
    logout:   () => api.post('/token/logout/'),
    me:       () => api.get('/compte/user/me/'),
    updateMe: (data) => api.patch('/compte/user/me/'),
    desactivateAccount: () => api.post('/compte/user/desactivate'), 
}


export default api