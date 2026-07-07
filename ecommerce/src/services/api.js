import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
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

// Refresh token via HttpOnly cookie (envoi automatique par le navigateur)
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;
    const isAuthEndpoint = original.url?.includes("/token/");

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        // 3. Le refresh token est dans le cookie HttpOnly → pas besoin de body
        const { data } = await axios.post(`${API_BASE_URL}/v1/auth/token/refresh/`);

        // 4. Stocker le nouvel access token en mémoire
        useAuthStore.setState({ access: data.access });

        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch (refreshError) {
        // 5. Échec du refresh → déconnexion et redirection
        useAuthStore.getState().logout();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api