import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { cartRecommendations, formatPrice } from '@/data/data.js';
import { useAuth } from '@/hooks/useAuth.js';
import Icon from '@/components/shared/Icon.jsx';

const paymentMethods = [
  {
    id: 'wave',
    name: 'Wave',
    type: 'Mobile Money Afrique',
    logo: 'https://www.wave.com/img/nav-logo.svg',
    badge: 'Populaire au Sénégal',
    tone: 'border-sky-200 bg-sky-50',
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    type: 'Mobile Money Afrique',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Logo_Orange_Money.svg',
    badge: 'SN, CI, ML, BF',
    tone: 'border-orange-200 bg-orange-50',
  },
  {
    id: 'mtn-momo',
    name: 'MTN MoMo',
    type: 'Mobile Money Afrique',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_2022_logo.svg',
    badge: 'Afrique de l’Ouest',
    tone: 'border-yellow-200 bg-yellow-50',
  },
  {
    id: 'moov-money',
    name: 'Moov Money',
    type: 'Mobile Money Afrique',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Moov_Money_Flooz.png',
    badge: 'Moov / Flooz',
    tone: 'border-orange-200 bg-orange-50',
  },
  {
    id: 'free-money',
    name: 'Free Money',
    type: 'Mobile Money Sénégal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
    badge: 'Sénégal',
    tone: 'border-red-200 bg-red-50',
  },
  {
    id: 'paydunya',
    name: 'PayDunya',
    type: 'Agrégateur local',
    logo: 'https://logo.clearbit.com/paydunya.com',
    badge: 'Cartes + Mobile Money',
    tone: 'border-blue-200 bg-blue-50',
  },
  {
    id: 'visa',
    name: 'Visa',
    type: 'Carte bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    badge: 'International',
    tone: 'border-blue-200 bg-blue-50',
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    type: 'Carte bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    badge: 'International',
    tone: 'border-red-200 bg-red-50',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'Portefeuille digital',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    badge: 'Compte PayPal',
    tone: 'border-sky-200 bg-sky-50',
  },
];

function hasVariants(product) {
  return product.variants && Object.keys(product.variants).length > 0;
}

function defaultVariantSelection(product) {
  return Object.fromEntries(Object.entries(product.variants || {}).map(([key, values]) => [key, values[0]]));
}

function variantLabel(selection) {
  return Object.entries(selection).map(([key, value]) => `${key}: ${value}`).join(' · ');
}

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, changeQty, removeItem, addToCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('wave');
  const [variantProduct, setVariantProduct] = useState(null);
  const [variantSelection, setVariantSelection] = useState({});
  const items = cartItems;
  const subtotal = items.reduce((s, item) => s + item.price * item.qty, 0);
  const totalQty = items.reduce((s, item) => s + item.qty, 0);
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 2500;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.012) : 0;
  const total = subtotal + shipping + serviceFee;
  const selected = paymentMethods.find(method => method.id === selectedPayment);

  const addRecommendedProduct = (product) => {
    if (hasVariants(product)) {
      setVariantProduct(product);
      setVariantSelection(defaultVariantSelection(product));
      return;
    }

    addToCart(product, false);
  };

  const confirmVariant = () => {
    const label = variantLabel(variantSelection);
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
      <div className="sticky top-0 z-20 bg-[#0d1b2a] text-white shadow-lg">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-orange-300 font-black">Checkout</div>
            <h1 className="font-['Barlow_Condensed'] text-[34px] font-black leading-none">Mon panier</h1>
          </div>
          <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded text-[13px] font-bold flex items-center gap-2">
            <Icon name="arrowLeft" /> Continuer mes achats
          </button>
        </div>
      </div>

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

            {items.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <Icon name="cartDownload" size={54} className="mx-auto mb-3 text-gray-200" />
                <div className="font-black text-[#0d1b2a]">Votre panier est vide</div>
                <p className="mt-1 text-[13px]">Ajoutez quelques produits avant de passer au paiement.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <article key={item.cartKey || item.id} className="p-4 grid grid-cols-[96px_1fr_auto] gap-4">
                    <button onClick={() => navigate(`/product/${item.id}`)} className="overflow-hidden rounded bg-gray-50">
                      <img src={item.img} alt={item.name} className="h-24 w-24 object-cover transition-transform hover:scale-105" />
                    </button>
                    <div>
                      <button onClick={() => navigate(`/product/${item.id}`)} className="text-left text-[15px] font-black text-[#0d1b2a] hover:text-orange-500">
                        {item.name}
                      </button>
                      <div className="mt-1 text-[12px] text-gray-400">{item.supplier || 'TradeHub Seller'}</div>
                      {item.selectedVariants && (
                        <div className="mt-1 text-[11px] font-bold text-orange-500">{variantLabel(item.selectedVariants)}</div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => changeQty(item.cartKey || item.id, -1)} className="h-8 w-8 rounded border border-gray-200 font-black hover:border-orange-400 hover:text-orange-500">−</button>
                        <span className="h-8 min-w-10 rounded bg-gray-50 px-3 text-center text-[14px] font-black leading-8">{item.qty}</span>
                        <button onClick={() => changeQty(item.cartKey || item.id, 1)} className="h-8 w-8 rounded border border-gray-200 font-black hover:border-orange-400 hover:text-orange-500">+</button>
                        <button onClick={() => removeItem(item.cartKey || item.id)} className="ml-2 flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:text-red-500">
                          <Icon name="trash" size={13} /> Retirer
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(item.price * item.qty)}</div>
                      <div className="text-[12px] text-gray-400">{formatPrice(item.price)} / unité</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-black text-[#0d1b2a]">Moyens de paiement</h2>
                <p className="text-[12px] text-gray-400">Cartes internationales et solutions Mobile Money africaines.</p>
              </div>
              <span className="flex items-center gap-1 rounded bg-green-50 px-3 py-1 text-[12px] font-black text-green-600">
                <Icon name="shield" size={14} /> Paiement sécurisé
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`relative rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${selectedPayment === method.id ? `${method.tone} ring-2 ring-orange-400` : 'border-gray-100 bg-white'}`}
                >
                  <div className="h-12 rounded bg-white flex items-center justify-center border border-gray-100">
                    <img src={method.logo} alt={method.name} className="max-h-8 max-w-[120px] object-contain" loading="lazy" />
                  </div>
                  <div className="mt-3 font-black text-[#0d1b2a] text-[13px]">{method.name}</div>
                  <div className="text-[11px] text-gray-400">{method.type}</div>
                  <div className="mt-2 text-[10px] font-black text-orange-500">{method.badge}</div>
                  {selectedPayment === method.id && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                      <Icon name="check" size={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-black text-[#0d1b2a]">Compléter votre panier</h2>
                <p className="text-[12px] text-gray-400">Accessoires et produits souvent ajoutés avant le paiement.</p>
              </div>
              <span className="rounded bg-orange-50 px-3 py-1 text-[12px] font-black text-orange-500">Ajout rapide</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {cartRecommendations.map(product => (
                <article key={product.id} className="group rounded-lg border border-gray-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <button onClick={() => navigate(`/product/${product.id}`)} className="relative block w-full overflow-hidden rounded bg-gray-50" style={{ aspectRatio: '4 / 3' }}>
                    <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    {product.discount && <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-[11px] font-black text-white">{product.discount}</span>}
                    {hasVariants(product) && <span className="absolute right-2 top-2 rounded bg-[#0d1b2a] px-2 py-0.5 text-[10px] font-black text-white">Variantes</span>}
                  </button>
                  <div className="pt-3">
                    <h3 className="min-h-[38px] text-[13px] font-black leading-tight text-[#0d1b2a]">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                      <span className="text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
                      <span>({product.reviews})</span>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <div className="font-['Barlow_Condensed'] text-[22px] font-black text-orange-500">{formatPrice(product.price)}</div>
                        {product.oldPrice && <div className="text-[11px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</div>}
                      </div>
                      <button onClick={() => addRecommendedProduct(product)} className="rounded bg-[#0d1b2a] px-3 py-2 text-[12px] font-black text-white hover:bg-orange-500">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <section className="bg-white rounded-lg shadow-sm p-5 sticky top-[92px]">
            <h2 className="text-[18px] font-black text-[#0d1b2a] mb-4">Résumé</h2>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-gray-500">
                <span>Sous-total</span>
                <span className="font-bold text-[#0d1b2a]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Livraison</span>
                <span className="font-bold text-[#0d1b2a]">{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Frais service</span>
                <span className="font-bold text-[#0d1b2a]">{formatPrice(serviceFee)}</span>
              </div>
            </div>
            <div className="my-4 border-t border-gray-100" />
            <div className="flex justify-between items-end">
              <span className="text-[14px] font-black text-[#0d1b2a]">Total à payer</span>
              <span className="font-['Barlow_Condensed'] text-[32px] font-black text-orange-500">{formatPrice(total)}</span>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <div className="text-[11px] uppercase tracking-wide text-gray-400 font-black mb-2">Paiement choisi</div>
              <div className="flex items-center gap-3">
                <span className="h-10 w-16 rounded bg-white border border-gray-100 flex items-center justify-center">
                  <img src={selected.logo} alt={selected.name} className="max-h-6 max-w-12 object-contain" />
                </span>
                <div>
                  <div className="text-[13px] font-black text-[#0d1b2a]">{selected.name}</div>
                  <div className="text-[11px] text-gray-400">{selected.type}</div>
                </div>
              </div>
            </div>

            <button disabled={items.length === 0} className="mt-4 w-full rounded bg-orange-500 py-3.5 text-[15px] font-black text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300">
              Payer maintenant
            </button>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-gray-400">
              <span className="rounded bg-gray-50 py-2">3D Secure</span>
              <span className="rounded bg-gray-50 py-2">Mobile Money</span>
              <span className="rounded bg-gray-50 py-2">Escrow</span>
            </div>
          </section>
        </aside>
      </div>

      {variantProduct && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div className="flex gap-3">
                <img src={variantProduct.img} alt={variantProduct.name} className="h-20 w-20 rounded object-cover" />
                <div>
                  <div className="text-[16px] font-black text-[#0d1b2a]">{variantProduct.name}</div>
                  <div className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(variantProduct.price)}</div>
                  <div className="text-[12px] text-gray-400">Choisissez vos options avant l'ajout.</div>
                </div>
              </div>
              <button onClick={() => setVariantProduct(null)} className="rounded bg-gray-100 p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
                <Icon name="times" size={16} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {Object.entries(variantProduct.variants).map(([variantName, values]) => (
                <div key={variantName}>
                  <div className="mb-2 text-[13px] font-black uppercase text-[#0d1b2a]">{variantName}</div>
                  <div className="flex flex-wrap gap-2">
                    {values.map(value => (
                      <button
                        key={value}
                        onClick={() => setVariantSelection(prev => ({ ...prev, [variantName]: value }))}
                        className={`rounded border px-3 py-2 text-[13px] font-bold transition-colors ${variantSelection[variantName] === value ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-5">
              <div className="text-[12px] text-gray-500">
                Sélection : <span className="font-black text-[#0d1b2a]">{variantLabel(variantSelection)}</span>
              </div>
              <button onClick={confirmVariant} className="rounded bg-orange-500 px-5 py-3 text-[13px] font-black text-white hover:bg-orange-600">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
