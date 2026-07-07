import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'; 
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({ 
      user: state.user,
      access: state.access,
      isAuthenticated: state.isAuthenticated,
      login: state.loginSuccess,
      logout: state.logout,
      loading: false,
    }))
  );
}

export function useLogin() {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      // MODIFICATION ICI — plus de refresh dans la réponse (cookie HttpOnly)
      const data = response?.data ?? response;
      loginSuccess(data.user, data.access);
      navigate('/');
    },
    onError: (error) => {
      console.error('Erreur d\'authentification API :', error.message);
    },
  });

  const serverError = loginMutation.error?.response?.data?.detail || loginMutation.error?.message;

  return {
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    error: serverError,
    resetError: loginMutation.reset,
  };
}

// AJOUT — Vérifier si l'utilisateur est connecté au load (cookie HttpOnly)
export function useCheckAuth() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['auth-check'],
    queryFn: async () => {
      const response = await authService.check();
      const data = response?.data ?? response;
      if (data?.authenticated && data?.user) {
        setUser(data.user);
      }
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// AJOUT — Déconnexion
export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      navigate('/');
    },
    onError: () => {
      // Même si l'API échoue, on déconnecte côté frontend
      logout();
      navigate('/');
    },
  });

  return {
    logout: logoutMutation.mutate,
    isPending: logoutMutation.isPending,
  };
}

export function useSignup() {
  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Erreur d\'inscription API :', error.message);
    },
  });

  const serverError = signUpMutation.error?.response?.data?.detail || signUpMutation.error?.message;

  return {
    signUp: signUpMutation.mutate,
    isPending: signUpMutation.isPending,
    error: serverError,
    resetError: signUpMutation.reset,
  };
}
