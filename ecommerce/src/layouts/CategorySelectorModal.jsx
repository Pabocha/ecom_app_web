import { useState } from 'react';
import { categories } from '@/data/data.js';
import { Car, Dumbbell, Factory, HeartPulse, House, Microchip, ShoppingBasket, Shirt, X } from 'lucide-react';

const catIconMap = {
  microchip: Microchip,
  shirt: Shirt,
  house: House,
  car: Car,
  heartPulse: HeartPulse,
  industry: Factory,
  shoppingBasket: ShoppingBasket,
  dumbbell: Dumbbell,
};

export default function CategorySelectorModal({ open, onClose, onSelectCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  if (!open) return null;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSubcatSelect = (subcat) => {
    onSelectCategory(subcat);
    onClose();
  };

  const SelectedIcon = catIconMap[selectedCategory.icon];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[600] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[601] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[500px] flex overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Sidebar - Parent Categories */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            {categories.map((cat) => {
              const CatIcon = catIconMap[cat.icon];
              return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat)}
                className={`w-full px-4 py-3.5 text-left border-l-4 transition-all flex items-center gap-3 ${
                  selectedCategory.name === cat.name
                    ? 'bg-white border-l-orange-500 font-bold text-gray-900'
                    : 'border-l-transparent hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: cat.bg }}
                >
                  <CatIcon size={16} className="text-gray-700" />
                </div>
                <span className="text-sm font-semibold">{cat.name}</span>
              </button>
            );
            })}
          </div>

          {/* Right Side - Subcategories Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: selectedCategory.bg }}
                >
                  <img
                    src={selectedCategory.img}
                    alt={selectedCategory.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{selectedCategory.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedCategory.badge && (
                      <span
                        className={`text-white text-xs font-bold px-2.5 py-1 rounded ${selectedCategory.badgeColor}`}
                      >
                        {selectedCategory.badge}
                      </span>
                    )}
                    <span className="text-gray-500 text-xs font-semibold">
                      {selectedCategory.count}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-3 gap-4">
              {selectedCategory.subcats.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => handleSubcatSelect(subcat)}
                  className="group flex flex-col items-center text-center transition-all hover:scale-105"
                >
                  {/* Placeholder icon/image for subcategory */}
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                    <SelectedIcon
                      size={40}
                      className="text-orange-400 opacity-60"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                    {subcat}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-lg z-10"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
