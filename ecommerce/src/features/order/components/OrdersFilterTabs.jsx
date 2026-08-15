import { ORDER_TABS } from '@/features/order/data/orderData';

export default function OrdersFilterTabs({ activeTab, onTabChange, countByStatus }) {
  return (
    <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
      {ORDER_TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.label)}
          className={`px-5 py-2.5 rounded-lg text-[13px] font-black transition-all whitespace-nowrap ${
            activeTab === tab.label
              ? 'bg-[#0d1b2a] text-white shadow-lg'
              : 'bg-white text-gray-500 hover:text-[#0d1b2a] shadow-sm'
          }`}
        >
          {tab.label}
          {tab.status && (
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
              activeTab === tab.label ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {countByStatus[tab.status] || 0}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
