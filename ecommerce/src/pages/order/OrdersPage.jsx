import { Box } from 'lucide-react';
import { useOrders } from '@/features/order/hooks/useOrders';
import OrdersFilterTabs from '@/features/order/components/OrdersFilterTabs';
import OrderCard from '@/features/order/components/OrderCard';
import TopBar from '@/components/shared/TopBar';

export default function OrdersPage() {
  const { activeTab, setActiveTab, filteredOrders, countByStatus } = useOrders();

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar />

      <div className="max-w-[1300px] mx-auto px-4 pt-5">
        <OrdersFilterTabs activeTab={activeTab} onTabChange={setActiveTab} countByStatus={countByStatus} />

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
      </div>
    </div>
  );
}
