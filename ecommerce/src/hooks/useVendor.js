import { useMutation } from "@tanstack/react-query";
import {vendorService} from "@/services/api.js";


export function useVendor() {
  const registerVendorMutation = useMutation({
    mutationFn: ({ formData, config }) => vendorService.register(formData, config),
    onSuccess: (response) => {
      console.log("Inscription du vendeur réussie !", response.data);
    },
    onError: (error) => {
      console.error("Erreur lors de l'inscription du vendeur :", error.message);
    },
  });

  const serverError = registerVendorMutation.error?.response?.data?.detail || registerVendorMutation.error?.message;

  return {
    createVendor: registerVendorMutation.mutate,
    createVendorAsync: registerVendorMutation.mutateAsync, // ✨ Ajoute ceci pour le async/await
    isPending: registerVendorMutation.isPending,
    error: serverError,
    resetError: registerVendorMutation.reset,
  };
}