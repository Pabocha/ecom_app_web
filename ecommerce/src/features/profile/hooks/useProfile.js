import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { profileService } from '@/features/profile/services/profileService';

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
      city: user?.city || '',
      postal_code: user?.postal_code || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateMe,
    onSuccess: () => setEditing(false),
  });

  return { editing, setEditing, form, updateMutation };
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
