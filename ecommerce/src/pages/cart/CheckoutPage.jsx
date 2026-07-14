import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CreditCard, Tag, MapPin, Plus } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';
import { useCart } from '@/features/cart/hooks/useCart';
import { useOrders } from '@/features/order/hooks/useOrders';
import { useAddresses } from '@/features/profile/hooks/useProfile';
import AddressCard from '@/components/shared/AddressCard';
import ModalAddressForm from '@/features/profile/components/ModalAddressForm';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const location = useLocation();
  const selectedItemKeys = location.state?.selectedItemKeys || [];
  const selectedKeysSet = useMemo(() => new Set(selectedItemKeys), [selectedItemKeys]);

  const [couponCode, setCouponCode] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { addresses, isLoading: isLoadingAddresses, addMutation, updateMutation } = useAddresses();

  const {
    checkout: {
      items: allItems,
      paymentMethod,
      couponMutation,
      couponResult,
      subtotal,
      shipping,
      serviceFee,
    },
    clearMutation,
  } = useCart();

  const items = useMemo(
    () => allItems.filter((item) => selectedKeysSet.has(item.cartKey || String(item.id))),
    [allItems, selectedKeysSet],
  );

  const discount = couponResult?.valid ? Number(couponResult.discount || 0) : 0;
  const total = Math.max(0, subtotal + shipping + serviceFee - discount);

  const { orderMutation } = useOrders({ clearMutation });

  // MODIFICATION ICI — Auto-sélection de l'adresse par défaut
  useEffect(() => {
    if (!addresses?.length) return;
    if (selectedAddressId) return;
    const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
  }, [addresses, selectedAddressId]);

  const selectedAddress = useMemo(
    () => addresses?.find((a) => a.id === selectedAddressId) || null,
    [addresses, selectedAddressId],
  );

  const handleApplyCoupon = (code) => {
    const nextCode = code?.trim();
    if (!nextCode) return;

    couponMutation.mutate({
      couponCode: nextCode,
      deliveryCost: shipping,
      cartItemIds: items.map((item) => item.lineId || item.id),
    });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!selectedAddress) return;

    const payload = {
      payment_method: paymentMethod?.id,
      phone_number: selectedAddress.phone_number || '',
      coupon_code: couponResult?.valid ? couponCode.trim() : '',
      shipping_address: {
        full_address: selectedAddress.street_address || '',
        city: selectedAddress.city || '',
        postal_code: selectedAddress.postal_code || '',
        country: selectedAddress.country || 'SN',
      },
    };

    orderMutation.mutate(payload);
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  const handleAddressSelected = (address) => {
    setSelectedAddressId(address.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="bg-[#0d1b2a] py-3.5 px-4">
        <div className="max-w-[1300px] mx-auto flex items-center gap-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-[14px] font-bold">Retour au panier</span>
          </button>
          <div className="font-['Barlow_Condensed'] text-3xl font-black text-white tracking-tight">
            Trade<span className="text-orange-500">Hub</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleCheckoutSubmit}>
        <div className="max-w-[1300px] mx-auto px-4 pt-5 grid grid-cols-[1fr_390px] gap-5">
          <main className="space-y-4">
            {/* MODIFICATION ICI — Section détails des articles */}
            <section className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-[18px] font-black text-[#0d1b2a] mb-4">Articles</h2>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.cartKey || item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img src={item.img || item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#0d1b2a] truncate">{item.name}</p>
                      {item.selectedVariants && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                        </p>
                      )}
                      <p className="text-[12px] text-gray-400 mt-0.5">Qté: {item.qty}</p>
                    </div>
                    <p className="text-[14px] font-black text-[#0d1b2a] whitespace-nowrap">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* MODIFICATION ICI — Section sélection adresse de livraison */}
            <section className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-orange-500" />
                  <h2 className="text-[18px] font-black text-[#0d1b2a]">Adresse de livraison</h2>
                </div>
                <Button size="sm" type="button" onClick={handleOpenAdd}>
                  <Plus size={14} /> Ajouter
                </Button>
              </div>

              {isLoadingAddresses && (
                <div className="text-center py-8 text-[13px] text-gray-400">Chargement des adresses...</div>
              )}

              {!isLoadingAddresses && addresses?.length === 0 && (
                <div className="text-center py-8">
                  <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-[13px] text-gray-400">Aucune adresse enregistrée</p>
                  <Button size="sm" className="mt-3" type="button" onClick={handleOpenAdd}>
                    <Plus size={14} /> Ajouter une adresse
                  </Button>
                </div>
              )}

              {!isLoadingAddresses && addresses?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      selected={addr.id === selectedAddressId}
                      onSelect={() => handleAddressSelected(addr)}
                      showRadio
                      showActions={addr.id === selectedAddressId}
                      onEdit={() => handleOpenEdit(addr)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-orange-500" />
                <h2 className="text-[18px] font-black text-[#0d1b2a]">Moyen de paiement</h2>
              </div>
              {paymentMethod && (
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <span className="h-10 w-16 rounded bg-white border border-gray-100 flex items-center justify-center">
                    <img src={paymentMethod.logo} alt={paymentMethod.name} className="max-h-6 max-w-12 object-contain" />
                  </span>
                  <div>
                    <div className="text-[13px] font-black text-[#0d1b2a]">{paymentMethod.name}</div>
                    <div className="text-[11px] text-gray-400">{paymentMethod.type}</div>
                  </div>
                </div>
              )}
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

              {/* MODIFICATION ICI — Code promo sous le prix total */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={15} className="text-orange-500" />
                  <span className="text-[13px] font-bold text-[#0d1b2a]">Code promo</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Entrez votre code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(couponCode)}
                    disabled={!couponCode || couponMutation.isPending}
                    className="rounded-lg bg-orange-500 px-4 py-2.5 text-[13px] font-black text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {couponMutation.isPending ? '...' : 'Appliquer'}
                  </button>
                </div>
                {couponResult && (
                  <div className={`mt-2 rounded-lg px-3 py-2 text-[12px] ${couponResult.valid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {couponResult.message}
                  </div>
                )}
                {couponResult?.valid && (
                  <div className="mt-2 flex justify-between text-[13px] text-green-600">
                    <span>Réduction</span>
                    <span className="font-bold">-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={orderMutation.isPending || items.length === 0 || !selectedAddress}
                className="mt-4 w-full rounded bg-orange-500 py-3.5 text-[15px] font-black text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {orderMutation.isPending ? (
                  'Traitement en cours...'
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Confirmer et payer
                  </>
                )}
              </button>

              {orderMutation.error && (
                <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {orderMutation.error?.response?.data?.detail || 'Erreur lors de la création de la commande. Veuillez réessayer.'}
                </div>
              )}
            </section>
          </aside>
        </div>
      </form>

      {/* MODIFICATION ICI — Modale ajout/édition adresse */}
      {modalOpen && (
        <ModalAddressForm
          address={editingAddress}
          onClose={handleCloseModal}
          addMutation={addMutation}
          updateMutation={updateMutation}
        />
      )}
    </div>
  );
}
