import { Box } from 'lucide-react';
import { useOrders } from '@/features/order/hooks/useOrders';
import OrdersFilterTabs from '@/features/order/components/OrdersFilterTabs';
import OrderCard from '@/features/order/components/OrderCard';
import TopBar from '@/components/shared/TopBar';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const { activeTab, setActiveTab, filteredOrders, countByStatus, isLoading, error } = useOrders();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar />

      <div className="max-w-[1300px] mx-auto px-4 pt-5">
        <OrdersFilterTabs activeTab={activeTab} onTabChange={setActiveTab} countByStatus={countByStatus} />

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-5 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-5 w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <p className="text-[13px] text-red-500">Une erreur est survenue lors du chargement des commandes.</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-[13px] font-bold text-orange-500 hover:underline">
              Réessayer
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                <Box size={48} className="mx-auto mb-3 text-gray-300" />
                <h3 className="text-[16px] font-black text-[#0d1b2a] mb-1">Aucune commande</h3>
                <p className="text-[13px] text-gray-400">Vous n'avez pas encore de commandes dans cette catégorie.</p>
                <button onClick={() => navigate('/')} className="mt-4 bg-orange-500 text-white px-5 py-2.5 rounded-lg text-[13px] font-black hover:bg-orange-600 transition-colors">
                  Découvrir les produits
                </button>
              </div>
            ) : (
              filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
