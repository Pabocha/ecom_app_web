import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignup } from "@/hooks/useAuth";
import Icon from "@/components/shared/Icon.jsx";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import { InputCountry } from "@/components/ui/InputCountry.jsx";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, isPending, error, resetError } = useSignup();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const countries = ["France", "Belgique", "Suisse", "Canada", "Autres"];
  const passwordValue = watch("password", "");
  const passwordConfirmValue = watch("passwordConfirm", "");

  useEffect(() => {
    if (passwordConfirmValue) {
      trigger("passwordConfirm");
    }
  }, [passwordValue, passwordConfirmValue, trigger]);

  const onSubmit = (data) => {
    const { passwordConfirm, ...dataToSend } = data;
    console.log("Form data to submit:", dataToSend);
    if (error) {
      resetError?.();
    }
    signUp(dataToSend);
  };

  const handleOAuth = (provider) => {
    alert(`Inscription ${provider} à implémenter`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1a2a3a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2a3a] px-6 py-8 text-center">
          <h1 className="text-3xl font-black text-white font-['Barlow_Condensed']">
            Trade<span className="text-orange-500">Hub</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Créer votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              required
              error={errors.email?.message}
              {...register("email", {
                required: "Email requis",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email invalide",
                },
              })}
            />
            <Input
              label="Téléphone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              required
              error={errors.phone_number?.message}
              {...register("phone_number", {
                required: "Téléphone requis",
                pattern: {
                  value: /^\+?\d{10,}$/,
                  message: "Numéro invalide (min 10 chiffres)",
                },
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              placeholder="Jean"
              required
              error={errors.first_name?.message}
              {...register("first_name", {
                required: "Le prénom est requis",
              })}
            />
            <Input
              label="Nom"
              placeholder="Dupont"
              required
              error={errors.last_name?.message}
              {...register("last_name", {
                required: "Le nom est requis",
              })}
            />
          </div>

          <Input
            label="Adresse"
            placeholder="123 Rue de la Paix"
            required
            error={errors.full_address?.message}
            {...register("full_address", {
              required: "L'adresse est requise",
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Ville"
              placeholder="Paris"
              required
              error={errors.city?.message}
              {...register("city", {
                required: "La ville est requise",
              })}
            />
            <Input
              label="Code postal"
              placeholder="75001"
              type="number"
              required
              error={errors.postal_code?.message}
              {...register("postal_code", {
                required: "Code postal requis",
                minLength: {
                  value: 3,
                  message: "Code postal invalide",
                },
              })}
            />
            <InputCountry
              label="Pays"
              required
              setValue={setValue}
              register={register}
              error={errors.country?.message} // Récupère l'erreur de validation
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Homme", value: "M" },
                  { label: "Femme", value: "F" },
                ].map((g) => (
                  <label
                    key={g.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      className="h-4 w-4"
                      value={g.value} // Envoie 'M' ou 'F' au backend
                      {...register("gender", {
                        required: "Le genre est requis",
                      })}
                    />
                    <span className="text-sm text-gray-700">{g.label}</span>{" "}
                    {/* Affiche 'Homme' ou 'Femme' */}
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <Input
              label="Date de naissance"
              type="date"
              required
              error={errors.date_of_birth?.message}
              {...register("date_of_birth", {
                required: "La date de naissance est requise",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              error={errors.password?.message}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <Icon name="eyeOff" size={16} />
                  ) : (
                    <Icon name="eye" size={16} />
                  )}
                </button>
              }
              {...register("password", {
                required: "Le mot de passe est requis",
                minLength: {
                  value: 6,
                  message: "Min 6 caractères",
                },
              })}
            />
            <Input
              label="Confirmer le mot de passe"
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="••••••••"
              required
              error={errors.passwordConfirm?.message}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPasswordConfirm ? (
                    <Icon name="eyeOff" size={16} />
                  ) : (
                    <Icon name="eye" size={16} />
                  )}
                </button>
              }
              {...register("passwordConfirm", {
                required: "Confirmation requise",
                validate: (value) =>
                  value === passwordValue ||
                  "Les mots de passe ne correspondent pas",
              })}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isPending}
          >
            {isPending ? "Création..." : "Créer mon compte"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou s'inscrire avec
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleOAuth("Google")}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span className="font-semibold text-gray-700 text-sm">
                  Google
                </span>
              </span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleOAuth("Facebook")}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">f</span>
                <span className="font-semibold text-gray-700 text-sm">
                  Facebook
                </span>
              </span>
            </Button>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
