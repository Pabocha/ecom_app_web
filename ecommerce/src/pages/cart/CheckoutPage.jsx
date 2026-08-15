import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CreditCard, Tag, MapPin, Plus, Truck, Ship, Plane, User, Phone } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAddresses } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrderCheckout } from '@/features/order/hooks/useOrderCheckout';
import { resolveCountry } from '@/features/payment/utils/helpers';
import AddressCard from '@/components/shared/AddressCard';
import ModalAddressForm from '@/features/profile/components/ModalAddressForm';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const location = useLocation();
  const selectedItemKeys = useMemo(() => location.state?.selectedItemKeys || [], [location.state?.selectedItemKeys]);
  const selectedKeysSet = useMemo(() => new Set(selectedItemKeys), [selectedItemKeys]);

  const [couponCode, setCouponCode] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [transportMode, setTransportMode] = useState('road');
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [paymentFirstName, setPaymentFirstName] = useState('');
  const [paymentLastName, setPaymentLastName] = useState('');
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState('');

  const { user } = useAuth();
  const { addresses, isLoading: isLoadingAddresses, addMutation, updateMutation } = useAddresses();

  const selectedAddress = useMemo(
    () => addresses?.find((a) => a.id === selectedAddressId) || null,
    [addresses, selectedAddressId],
  );

  const displayAddress = useMemo(() => {
    if (selectedAddress) return selectedAddress;
    if (!addresses?.length) return null;
    return addresses.find((a) => a.is_default) || addresses[0];
  }, [selectedAddress, addresses]);

  // AJOUT — Pays pour filtrer les moyens de paiement (adresse de livraison prioritaire)
  const country = resolveCountry(user?.country, displayAddress?.country);

  const {
    checkout: {
      items: allItems,
      paymentMethod: defaultPaymentMethod,
      paymentMethods,
      shippingMethod,
      setShippingMethod,
      shippingMethods,
      couponMutation,
      couponResult,
      subtotal,
    },
    clearMutation,
  } = useCart({ country });

  const items = useMemo(
    () => allItems.filter((item) => selectedKeysSet.has(item.cartKey || String(item.id))),
    [allItems, selectedKeysSet],
  );

  // AJOUT — Sélection effective : si la liste change (pays différent), on retombe sur la première méthode
  const effectiveSelectedPaymentId =
    selectedPaymentId && paymentMethods.some((m) => m.id === selectedPaymentId)
      ? selectedPaymentId
      : (paymentMethods[0]?.id ?? null);

  const paymentMethod = useMemo(
    () => paymentMethods.find((m) => m.id === effectiveSelectedPaymentId) || defaultPaymentMethod,
    [effectiveSelectedPaymentId, defaultPaymentMethod, paymentMethods],
  );

  const discount = couponResult?.valid ? Number(couponResult.discount || 0) : 0;

  const {
    previewMutation,
    previewData,
    effectiveTransportMode,
    submitMutation,
    submitOrder,
    error: checkoutError,
  } = useOrderCheckout({
    cartItems: items,
    selectedAddress: displayAddress,
    paymentMethod,
    shippingMethod,
    transportMode,
    couponCode: couponResult?.valid ? couponCode.trim() : '',
    couponDiscount: discount,
    paymentDetails: {
      first_name: paymentFirstName,
      last_name: paymentLastName,
      phone_number: paymentPhoneNumber,
    },
    clearMutation,
  });

  const deliveryCost = previewData?.shipping?.delivery_cost ?? previewData?.delivery_cost ?? null;
  const total = previewData?.total_amount ?? null;
  const isPreviewLoading = previewMutation.isPending;
  const isInternational = previewData?.shipping?.is_international ?? false;

  const handleAddressSelected = useCallback((address) => {
    setSelectedAddressId(address.id);
    setPaymentFirstName(address.first_name || '');
    setPaymentLastName(address.last_name || '');
    setPaymentPhoneNumber(address.phone_number || '');
  }, []);

  const handleApplyCoupon = useCallback((code) => {
    const nextCode = code?.trim();
    if (!nextCode) return;
    couponMutation.mutate({
      couponCode: nextCode,
      cartItemIds: items.map((item) => item.lineId || item.id),
    });
  }, [couponMutation, items]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!displayAddress || !items.length) return;
    submitOrder();
  };

  const handleOpenAdd = useCallback(() => {
    setEditingAddress(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((address) => {
    setEditingAddress(address);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingAddress(null);
  }, []);

  const isProcessing = submitMutation.isPending;
  const displayError = previewMutation.error?.response?.data?.detail || checkoutError;
  const isPaymentFormValid = paymentFirstName.trim() && paymentLastName.trim() && paymentPhoneNumber.trim();

  useEffect(() => {
    const addrId = selectedAddressId || displayAddress?.id;
    if (!addrId || !items.length) return;
    previewMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, displayAddress?.id, shippingMethod, transportMode, couponResult]);

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

            {!isInternational && (
              <section className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={18} className="text-orange-500" />
                  <h2 className="text-[18px] font-black text-[#0d1b2a]">Méthode de livraison</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {shippingMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setShippingMethod(method.id)}
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                        shippingMethod === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Truck size={20} className={shippingMethod === method.id ? 'text-orange-500' : 'text-gray-400'} />
                      <div>
                        <div className="text-[14px] font-black text-[#0d1b2a]">{method.label}</div>
                        <div className="text-[11px] text-gray-400">{method.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {isInternational && (
              <section className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Ship size={18} className="text-orange-500" />
                  <h2 className="text-[18px] font-black text-[#0d1b2a]">Mode de transport international</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTransportMode('sea')}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      effectiveTransportMode === 'sea'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Ship size={20} className={effectiveTransportMode === 'sea' ? 'text-orange-500' : 'text-gray-400'} />
                    <div>
                      <div className="text-[14px] font-black text-[#0d1b2a]">Mer</div>
                      <div className="text-[11px] text-gray-400">Par voie maritime</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportMode('air')}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      effectiveTransportMode === 'air'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Plane size={20} className={effectiveTransportMode === 'air' ? 'text-orange-500' : 'text-gray-400'} />
                    <div>
                      <div className="text-[14px] font-black text-[#0d1b2a]">Air</div>
                      <div className="text-[11px] text-gray-400">Par voie aérienne</div>
                    </div>
                  </button>
                </div>
              </section>
            )}

            <section className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-orange-500" />
                <h2 className="text-[18px] font-black text-[#0d1b2a]">Moyen de paiement</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentId(method.id)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                      paymentMethod?.id === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="h-8 w-12 rounded bg-white border border-gray-100 flex items-center justify-center shrink-0">
                      {method.logo ? (
                        <img src={method.logo} alt={method.name} className="max-h-5 max-w-10 object-contain" />
                      ) : (
                        <span className="font-['Barlow_Condensed'] text-[16px] font-black text-gray-300">
                          {method.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-black text-[#0d1b2a] truncate">{method.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{method.type}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-[14px] font-black text-[#0d1b2a] mb-3 flex items-center gap-2">
                  <User size={15} className="text-orange-500" />
                  Informations de paiement
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 mb-1">Prénom</label>
                      <input
                        type="text"
                        value={paymentFirstName}
                        onChange={(e) => setPaymentFirstName(e.target.value)}
                        placeholder="Prénom"
                        required
                        className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 mb-1">Nom</label>
                      <input
                        type="text"
                        value={paymentLastName}
                        onChange={(e) => setPaymentLastName(e.target.value)}
                        placeholder="Nom"
                        required
                        className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-1">Numéro de téléphone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={paymentPhoneNumber}
                        onChange={(e) => setPaymentPhoneNumber(e.target.value)}
                        placeholder="+221 77 123 45 67"
                        required
                        className="w-full rounded-lg border-2 border-gray-200 pl-9 pr-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
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
                  <span>Livraison{previewData?.shipping?.estimated_days ? ` (${previewData.shipping.estimated_days})` : ''}</span>
                  <span className="font-bold text-[#0d1b2a]">
                    {isPreviewLoading ? (
                      <span className="text-gray-400 italic">Calcul...</span>
                    ) : deliveryCost === null ? (
                      <span className="text-gray-400 italic">—</span>
                    ) : deliveryCost === 0 ? (
                      'Gratuite'
                    ) : (
                      formatPrice(deliveryCost)
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="text-green-600">
                    <div className="flex justify-between">
                      <span>Réduction</span>
                      <span className="font-bold">-{formatPrice(discount)}</span>
                    </div>
                    {couponResult?.discountType === 'percent' && (
                      <div className="text-[11px] text-green-500 mt-0.5">{couponResult.discountValue}% sur le panier</div>
                    )}
                    {couponResult?.discountType === 'fixed' && (
                      <div className="text-[11px] text-green-500 mt-0.5">{formatPrice(couponResult.discountValue)} de réduction</div>
                    )}
                    {couponResult?.discountType === 'shipping' && (
                      <div className="text-[11px] text-green-500 mt-0.5">Livraison gratuite</div>
                    )}
                  </div>
                )}
              </div>

              <div className="my-4 border-t border-gray-100" />

              <div className="flex justify-between items-end">
                <span className="text-[14px] font-black text-[#0d1b2a]">Total à payer</span>
                <span className="font-['Barlow_Condensed'] text-[32px] font-black text-orange-500">
                  {isPreviewLoading ? (
                    <span className="text-[20px] text-gray-400 italic">Calcul...</span>
                  ) : total !== null ? (
                    formatPrice(total)
                  ) : (
                    <span className="text-[20px] text-gray-400">—</span>
                  )}
                </span>
              </div>

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
              </div>

              <button
                type="submit"
                disabled={isProcessing || items.length === 0 || !displayAddress || !isPaymentFormValid}
                className="mt-4 w-full rounded bg-orange-500 py-3.5 text-[15px] font-black text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {submitMutation.isPending ? (
                  'Traitement en cours...'
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Confirmer et payer
                  </>
                )}
              </button>

              {displayError && (
                <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {displayError}
                </div>
              )}
            </section>
          </aside>
        </div>
      </form>

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
