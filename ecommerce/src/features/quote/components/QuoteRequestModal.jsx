import { useState } from 'react';
import { X, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatPrice, formatPriceAmount, activeProductPrice } from '@/utils/helpers';
import { productService } from '@/features/product/services/productService';
import { useQuery } from '@tanstack/react-query';

// MODIFICATION ICI — Modale de demande de devis (client → vendeur)
const VALIDITIES = [
  { label: '7 jours', days: 7 },
  { label: '15 jours', days: 15 },
  { label: '30 jours', days: 30 },
];

// Aplatit l'arbre de variantes (variants-list) en feuilles { id, label, price }
function flattenLeafVariants(structure, nodes, depth = 0, path = []) {
  const leaves = [];
  for (const node of nodes || []) {
    const nextPath = [...path, node.value];
    if (depth === (structure?.length || 1) - 1) {
      for (const leaf of node.children || []) {
        leaves.push({
          id: leaf.id,
          sku: leaf.sku,
          label: nextPath.join(' · '),
          price: leaf.price_override ?? null,
        });
      }
    } else {
      leaves.push(...flattenLeafVariants(structure, node.children, depth + 1, nextPath));
    }
  }
  return leaves;
}

export default function QuoteRequestModal({ product, shopId, onClose, createMutation }) {
  const [variantId, setVariantId] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [validity, setValidity] = useState(VALIDITIES[0].days);
  const [remarks, setRemarks] = useState('');

  const hasVariants = Boolean(product?.has_variant);

  const { data: variantsData, isLoading: isLoadingVariants } = useQuery({
    queryKey: ['product-variants', product?.id],
    queryFn: () => productService.getProductVariant(product.id),
    enabled: Boolean(hasVariants && product?.id),
    select: (resp) => {
      const d = resp?.data || resp || {};
      return flattenLeafVariants(d.structure, d.variants);
    },
  });

  const productPrice = activeProductPrice(product);
  const activePrice = variantId != null
    ? (variantsData?.find((v) => v.id === variantId)?.price ?? productPrice)
    : productPrice;
  const priceValue = price === '' ? '' : price;

  const minQty = Number(product?.min_order_quantity) || 1;
  const qtyValue = quantity === '' ? '' : quantity;

  const isValid =
    (!hasVariants || variantId != null) &&
    Number(qtyValue) >= minQty &&
    Number(priceValue) > 0;

  const submit = () => {
    if (!isValid) return;
    const expiresAt = new Date(Date.now() + validity * 86400000).toISOString();
    createMutation.mutate(
      {
        shop: shopId,
        expires_at: expiresAt,
        lines: [
          {
            ...(variantId != null ? { variant: variantId } : { product: product.id }),
            quantity: Number(qtyValue),
            negotiated_price: String(Number(priceValue)),
            ...(remarks.trim() ? { remarks: remarks.trim() } : {}),
          },
        ],
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <FileText size={17} />
            </span>
            <div>
              <h3 className="text-[16px] font-black text-[#0d1b2a]">Demander un devis</h3>
              <p className="text-[12px] text-gray-400">Proposez un prix au vendeur pour ce produit</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded bg-gray-100 p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            {product?.image ? (
              <img src={product.image} alt="" className="h-14 w-14 rounded-md object-cover" />
            ) : (
              <span className="h-14 w-14 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                IMG
              </span>
            )}
            <div className="min-w-0">
              <div className="text-[13px] font-black text-[#0d1b2a] line-clamp-2">{product?.name}</div>
              <div className="text-[11px] text-gray-400">
                Prix public : {formatPrice(productPrice)} · Qté min. : {minQty}
              </div>
            </div>
          </div>

          {hasVariants && (
            <div>
              <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Variante</label>
              {isLoadingVariants ? (
                <div className="rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] text-gray-400">
                  Chargement des variantes…
                </div>
              ) : (
                <select
                  value={variantId ?? ''}
                  onChange={(e) => setVariantId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Sélectionnez une variante…</option>
                  {(variantsData || []).map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}{v.price != null ? ` — ${formatPriceAmount(v.price)}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Quantité</label>
              <input
                type="number"
                min={minQty}
                value={qtyValue}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={String(minQty)}
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">Minimum : {minQty}</p>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Prix proposé (FCFA)</label>
              <input
                type="number"
                min="0"
                value={priceValue}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={String(Math.round(activePrice || productPrice))}
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">Prix unitaire négocié</p>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Validité de l'offre</label>
            <div className="grid grid-cols-3 gap-2">
              {VALIDITIES.map((v) => (
                <button
                  key={v.days}
                  type="button"
                  onClick={() => setValidity(v.days)}
                  className={`rounded-lg border-2 px-3 py-2 text-[12px] font-black transition-all ${
                    validity === v.days
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Remarques (optionnel)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Détaillez votre besoin : emballage, livraison, échantillon…"
              className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button variant="ghost" fullWidth onClick={onClose}>Annuler</Button>
            <Button
              fullWidth
              loading={createMutation.isPending}
              disabled={!isValid}
              onClick={submit}
            >
              Envoyer la demande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
