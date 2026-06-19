import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { featuredProducts, formatPrice } from '@/data/data.js';
import ProductCard from '@/components/product/ProductCard.jsx';
import { BarChart3, Box, Building2, FileText, Headphones, ShoppingCart, Truck } from 'lucide-react';

const b2bIcons = {
  building: Building2,
  box: Box,
  chartLine: BarChart3,
  truck: Truck,
  headset: Headphones,
};

export default function B2BPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [quoteModal, setQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({ email: '', company: '', phone: '', product: null });

  // Tarifs dégressifs B2B
  const getPricingTiers = (basePrice) => [
    { min: 1, max: 9, discount: 0, price: basePrice },
    { min: 10, max: 49, discount: 10, price: basePrice * 0.9 },
    { min: 50, max: 99, discount: 15, price: basePrice * 0.85 },
    { min: 100, max: 249, discount: 20, price: basePrice * 0.8 },
    { min: 250, max: 499, discount: 25, price: basePrice * 0.75 },
    { min: 500, max: null, discount: 30, price: basePrice * 0.7 },
  ];

  const getAppliedPrice = (basePrice, qty) => {
    const tiers = getPricingTiers(basePrice);
    const tier = tiers.find(t => qty >= t.min && (!t.max || qty <= t.max));
    return tier ? tier.price : basePrice;
  };

  const handleQuoteSubmit = (product) => {
    setQuoteData({ ...quoteData, product });
    setQuoteModal(true);
  };

  const handleOpenProduct = (product) => navigate(`/product/${product.id}`);
  const handleOpenFlashDeals = () => navigate('/flash-deals');
  const handleOpenCategory = (category) => navigate(`/category/${category?.name || category}`);

  const submitQuote = () => {
    if (quoteData.email && quoteData.company && quoteData.phone) {
      alert(`Devis envoyé pour ${quoteData.product.name} à ${quoteData.email}`);
      setQuoteModal(false);
      setQuoteData({ email: '', company: '', phone: '', product: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2a3a] text-white">
        <div className="max-w-[1300px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="text-orange-400 text-sm font-bold mb-2">PROGRAMME B2B</div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">Achats en Gros</h1>
              <p className="text-lg text-gray-300 mb-6">
                Tarifs dégressifs jusqu'à -30%, conditions de paiement flexibles, support dédié et livraison groupée.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                   <FileText size={18} /> Demander un devis
                </button>
                <button onClick={handleOpenFlashDeals} className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'building', value: '+5,000', label: 'Clients B2B' },
                { icon: 'box', value: '50M+', label: 'Produits listés' },
                { icon: 'chartLine', value: '-30%', label: 'Réduction max' },
                { icon: 'truck', value: '24/48h', label: 'Livraison express' },
              ].map((stat, i) => {
                const StatIcon = b2bIcons[stat.icon] || Building2;
                return (
                  <div key={i} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                    <StatIcon size={28} className="text-orange-400 mb-2" />
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[1300px] mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
          <span className="font-bold text-gray-700">Filtrer par:</span>
          {['Tous', 'Électronique', 'Mode', 'Industrie', 'Alimentation'].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-500 font-semibold text-gray-700 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.slice(0, 12).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div
                className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer group"
                onClick={() => handleOpenProduct(product)}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                  B2B
                </span>
                {product.discount && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3
                  className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
                  onClick={() => handleOpenProduct(product)}
                >
                  {product.name}
                </h3>

                {/* Pricing Tiers */}
                <div className="mb-4 bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div className="text-xs font-bold text-orange-600 mb-2">Tarifs dégressifs:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">1-9 unités:</span>
                      <span className="font-bold text-gray-800">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">10-99 unités:</span>
                      <span className="font-bold text-orange-600">-10% {formatPrice(product.price * 0.9)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">100-499 unités:</span>
                      <span className="font-bold text-orange-600">-20% {formatPrice(product.price * 0.8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">500+ unités:</span>
                      <span className="font-bold text-orange-700">-30% {formatPrice(product.price * 0.7)}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-700 block mb-2">Quantité:</label>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity[product.id] || 10}
                    onChange={(e) =>
                      setSelectedQuantity({ ...selectedQuantity, [product.id]: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                  />
                  <div className="text-xs text-orange-600 font-semibold mt-1">
                    Total: {formatPrice(getAppliedPrice(product.price, selectedQuantity[product.id] || 10) * (selectedQuantity[product.id] || 10))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <ShoppingCart size={14} /> Ajouter
                  </button>
                  <button
                    onClick={() => handleQuoteSubmit(product)}
                    className="flex-1 px-3 py-2 border-2 border-orange-500 hover:bg-orange-50 text-orange-600 font-bold rounded-lg transition-colors text-sm"
                  >
                    Devis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avantages B2B */}
      <div className="max-w-[1300px] mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Avantages B2B TradeHub</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'chartLine', title: 'Tarifs dégressifs', desc: 'Jusqu\'à -30% selon quantité' },
            { icon: 'building', title: 'Paiement B2B', desc: 'Conditions flexibles et délais nets' },
            { icon: 'truck', title: 'Livraison groupée', desc: 'Économisez sur les frais de port' },
            { icon: 'headset', title: 'Support dédié', desc: 'Gestionnaire de compte attitré' },
            ].map((adv, i) => {
            const AdvIcon = b2bIcons[adv.icon] || Building2;
            return (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <AdvIcon size={24} className="text-orange-600" />
              </div>
              <h3 className="font-black text-gray-800 mb-2">{adv.title}</h3>
              <p className="text-gray-600 text-sm">{adv.desc}</p>
            </div>
            );
          })}
        </div>
      </div>

      {/* Quote Modal */}
      {quoteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[600]"
            onClick={() => setQuoteModal(false)}
          />
          <div className="fixed inset-0 z-[601] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-black text-gray-800 mb-4">Demander un devis</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Entreprise</label>
                  <input
                    type="text"
                    value={quoteData.company}
                    onChange={(e) => setQuoteData({ ...quoteData, company: e.target.value })}
                    placeholder="Nom de votre entreprise"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={quoteData.email}
                    onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={quoteData.phone}
                    onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                    placeholder="+221 77 XXX XX XX"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setQuoteModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={submitQuote}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
