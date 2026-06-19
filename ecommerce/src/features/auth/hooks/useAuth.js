import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'; 
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({ 
      user: state.user,
      access: state.access,
      refresh: state.refresh,
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
      const data = response?.data ?? response;
      loginSuccess(data.user, data.access, data.refresh);
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
