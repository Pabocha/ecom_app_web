import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { cartRecommendations } from '@/data/data.js';
import CartItemList from '@/features/cart/components/CartItemList';
import CartRecommendations from '@/features/cart/components/CartRecommendations';
import VariantModal from '@/components/VariantModal';
import PaymentSelector from '@/features/cart/components/PaymentSelector';
import CartSummary from '@/features/cart/components/CartSummary';
import TopBar from '@/components/shared/TopBar';

function hasVariants(product) {
  return product.variants && Object.keys(product.variants).length > 0;
}

function defaultVariantSelection(product) {
  return Object.fromEntries(
    Object.entries(product.variants || {}).map(([key, values]) => [key, values[0]])
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, changeQty, removeItem, addToCart, isPending } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('wave');
  const [variantProduct, setVariantProduct] = useState(null);
  const [variantSelection, setVariantSelection] = useState({});

  const items = cartItems;
  const subtotal = items.reduce((s, item) => s + item.price * item.qty, 0);
  const totalQty = items.reduce((s, item) => s + item.qty, 0);
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 2500;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.012) : 0;
  const total = subtotal + shipping + serviceFee;

  const addRecommendedProduct = (product) => {
    if (hasVariants(product)) {
      setVariantProduct(product);
      setVariantSelection(defaultVariantSelection(product));
      return;
    }
    addToCart(product, false);
  };

  const confirmVariant = () => {
    const label = Object.entries(variantSelection)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' · ');
    addToCart({
      ...variantProduct,
      cartKey: `${variantProduct.id}-${Object.values(variantSelection).join('-')}`,
      name: `${variantProduct.name} (${label})`,
      selectedVariants: variantSelection,
    }, false);
    setVariantProduct(null);
    setVariantSelection({});
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar backLabel="Continuer mes achats" />

      <div className="max-w-[1300px] mx-auto px-4 pt-5 grid grid-cols-[1fr_390px] gap-5">
        <main className="space-y-4">
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-[#0d1b2a]">Articles sélectionnés</h2>
                <p className="text-[12px] text-gray-400">{totalQty} article{totalQty > 1 ? 's' : ''} dans votre panier</p>
              </div>
              <span className="rounded bg-orange-50 px-3 py-1 text-[12px] font-black text-orange-500">Livraison gratuite dès 50 000 FCFA</span>
            </div>
            <CartItemList items={items} totalQty={totalQty} onQty={changeQty} onRemove={removeItem} onItemClick={(id) => navigate(`/product/${id}`)} isPending={isPending} />
          </section>

          <PaymentSelector selectedPayment={selectedPayment} onSelectPayment={setSelectedPayment} />

          <section className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-black text-[#0d1b2a]">Compléter votre panier</h2>
                <p className="text-[12px] text-gray-400">Accessoires et produits souvent ajoutés avant le paiement.</p>
              </div>
              <span className="rounded bg-orange-50 px-3 py-1 text-[12px] font-black text-orange-500">Ajout rapide</span>
            </div>
            <CartRecommendations products={cartRecommendations} onProductClick={(id) => navigate(`/product/${id}`)} onAddToCart={addRecommendedProduct} />
          </section>
        </main>

        <aside className="space-y-4">
          <CartSummary subtotal={subtotal} shipping={shipping} serviceFee={serviceFee} total={total} selectedPayment={selectedPayment} hasItems={items.length > 0} />
        </aside>
      </div>

      <VariantModal
        product={variantProduct}
        selection={variantSelection}
        onSelectionChange={(name, value) => setVariantSelection(prev => ({ ...prev, [name]: value }))}
        onConfirm={confirmVariant}
        onClose={() => { setVariantProduct(null); setVariantSelection({}); }}
      />
    </div>
  );
}
