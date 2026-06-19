import { ORDER_TABS } from '@/features/order/data/orderData';

export default function OrdersFilterTabs({ activeTab, onTabChange, countByStatus }) {
  const getStatusKey = (tab) => {
    const map = { 'En cours': 'pending', 'Livrées': 'delivered', 'Annulées': 'cancelled' };
    return map[tab];
  };

  return (
    <div className="flex gap-1 mb-5">
      {ORDER_TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-2.5 rounded-lg text-[13px] font-black transition-all ${
            activeTab === tab
              ? 'bg-[#0d1b2a] text-white shadow-lg'
              : 'bg-white text-gray-500 hover:text-[#0d1b2a] shadow-sm'
          }`}
        >
          {tab}
          {tab !== 'Toutes' && (
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
              activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {countByStatus[getStatusKey(tab)]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
