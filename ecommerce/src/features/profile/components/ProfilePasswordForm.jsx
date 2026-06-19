import { Eye, EyeOff, Lock, Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProfilePasswordForm({ passwordForm }) {
  const {
    changingPassword, setChangingPassword,
    showCurrentPwd, setShowCurrentPwd,
    showNewPwd, setShowNewPwd,
    showConfirmPwd, setShowConfirmPwd,
    newPasswordValue, form, passwordMutation,
  } = passwordForm;

  const { register: registerPwd, handleSubmit: handleSubmitPwd, formState: { errors: errorsPwd } } = form;

  const onPasswordSubmit = (data) => {
    passwordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
    });
  };

  if (!changingPassword) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
            <Lock size={18} />
          </span>
          <div>
            <h2 className="text-[16px] font-black text-[#0d1b2a]">Sécurité</h2>
            <p className="text-[12px] text-gray-400">Mot de passe et authentification</p>
          </div>
        </div>
        <Button variant="secondary" size="md" onClick={() => setChangingPassword(true)}>
          <Lock size={14} /> Changer le mot de passe
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <form onSubmit={handleSubmitPwd(onPasswordSubmit)}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-black text-[#0d1b2a]">Modifier le mot de passe</h2>
            <p className="text-[12px] text-gray-400">Choisissez un mot de passe sécurisé</p>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={() => { setChangingPassword(false); setShowCurrentPwd(false); setShowNewPwd(false); setShowConfirmPwd(false); }}>
            <X size={14} /> Annuler
          </Button>
        </div>

        <Input
          label="Mot de passe actuel"
          type={showCurrentPwd ? 'text' : 'password'}
          placeholder="••••••••"
          error={errorsPwd.current_password?.message}
          suffix={
            <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="text-gray-500 hover:text-gray-700">
              {showCurrentPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          {...registerPwd('current_password', { required: 'Requis' })}
        />

        <div className="mt-4">
          <Input
            label="Nouveau mot de passe"
            type={showNewPwd ? 'text' : 'password'}
            placeholder="••••••••"
            error={errorsPwd.new_password?.message}
            suffix={
              <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="text-gray-500 hover:text-gray-700">
                {showNewPwd ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
            {...registerPwd('new_password', {
              required: 'Requis',
              minLength: { value: 6, message: 'Au moins 6 caractères' },
            })}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Confirmer le mot de passe"
            type={showConfirmPwd ? 'text' : 'password'}
            placeholder="••••••••"
            error={errorsPwd.confirm_password?.message}
            suffix={
              <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="text-gray-500 hover:text-gray-700">
                {showConfirmPwd ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
            {...registerPwd('confirm_password', {
              required: 'Requis',
              validate: (val) => val === newPasswordValue || 'Les mots de passe ne correspondent pas',
            })}
          />
        </div>

        {passwordMutation.error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            ❌ {passwordMutation.error?.response?.data?.detail || 'Erreur lors du changement de mot de passe'}
          </div>
        )}

        {passwordMutation.isSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            ✓ Mot de passe modifié avec succès
          </div>
        )}

        <div className="mt-5">
          <Button type="submit" size="md" loading={passwordMutation.isPending}>
            <Save size={14} /> Enregistrer le mot de passe
          </Button>
        </div>
      </form>
    </div>
  );
}
