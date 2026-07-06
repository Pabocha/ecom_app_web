import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={44} className="text-green-600" />
        </div>

        <h1 className="text-[24px] font-black text-[#0d1b2a]">Commande confirmée !</h1>
        <p className="mt-2 text-[14px] text-gray-500 leading-relaxed">
          Merci pour votre achat. Votre commande a été reçue et est en cours de traitement.
        </p>
        <p className="mt-1 text-[13px] text-gray-400">
          Un email de confirmation vous sera envoyé sous peu.
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate('/profile/orders')}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 py-3.5 text-[15px] font-black text-white transition-colors hover:bg-orange-600"
          >
            <Package size={18} />
            Voir mes commandes
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 py-3.5 text-[15px] font-black text-[#0d1b2a] transition-colors hover:border-orange-300 hover:text-orange-500"
          >
            <Home size={18} />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
