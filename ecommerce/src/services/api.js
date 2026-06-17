import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Injecter le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token automatique si 401
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;
    const isAuthEndpoint = original.url?.includes("/token/");

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        // 3. On récupère le refresh token depuis Zustand
        const refresh = useAuthStore.getState().refresh;
        
        const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh,
        });

        // 4. ON MET À JOUR ZUSTAND DIRECTEMENT !
        // (Zustand s'occupera TOUT SEUL de mettre à jour le localStorage proprement)
        useAuthStore.setState({ access: data.access });

        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch (refreshError) {
        // 5. En cas d'échec, on demande à Zustand de vider l'état ou de logout
        // Si tu as une action logout() dans ton store : useAuthStore.getState().logout()
        useAuthStore.setState({ access: null, refresh: null, isAuthenticated: false, user: null });
        
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
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

// ── Vendor ───────────────────────────────────────

export const vendorService = {
    register: (data, config) => api.post('/compte/seller-account/', data, config),
    getMyVendor: () => api.get('/compte/seller-account/me/'),
    updateMyVendor: (data) => api.patch('/compte/seller-account/me/'),
    desactivateVendor: () => api.post('/compte/seller-account/desactivate'), 
}


export default api