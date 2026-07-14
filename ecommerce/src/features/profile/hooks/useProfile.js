import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { profileService } from '@/features/profile/services/profileService';

// MODIFICATION ICI — Query key centralisée pour les adresses
export const ADDRESSES_QUERY_KEY = ['addresses'];

// MODIFICATION ICI — Hook CRUD adresses via React Query
export function useAddresses() {
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: async () => {
      const resp = await profileService.getAddressUser();
      const data = resp?.data ?? resp;
      return data?.results || data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: profileService.addAddressUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => profileService.updateAddressUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => profileService.deleteAddressUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY }),
  });

  return { addresses, isLoading, addMutation, updateMutation, deleteMutation };
}

export function useProfileForm(user) {
  const [editing, setEditing] = useState(false);

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      full_address: user?.full_address || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateMe,
    onSuccess: () => setEditing(false),
  });

  return { editing, setEditing, form, updateMutation };
}

export function useAddressForm(address) {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      first_name: address?.first_name || '',
      last_name: address?.last_name || '',
      phone_number: address?.phone_number || '',
      street_address: address?.street_address || '',
      city: address?.city || '',
      state_region: address?.state_region || '',
      postal_code: address?.postal_code || '',
      country: address?.country || 'SN',
      address_type: address?.address_type || 'shipping',
      is_default: address?.is_default || false,
    },
  });

  return { form };
}
export function usePasswordForm() {
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const form = useForm({ mode: 'onBlur' });
  const newPasswordValue = form.watch('new_password', '');

  const passwordMutation = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => {
      setChangingPassword(false);
      setShowCurrentPwd(false);
      setShowNewPwd(false);
      setShowConfirmPwd(false);
      form.reset();
    },
  });

  return {
    changingPassword, setChangingPassword,
    showCurrentPwd, setShowCurrentPwd,
    showNewPwd, setShowNewPwd,
    showConfirmPwd, setShowConfirmPwd,
    newPasswordValue, form, passwordMutation,
  };
}
