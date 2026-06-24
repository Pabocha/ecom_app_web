import { useState } from 'react';
import { featuredProducts } from '@/data/data.js';
import { formatPrice, getProductPricing, getProductBadges, getPromoDiscount } from '@/utils/helpers.js';
import { buildDetailFromApi } from '@/features/product/utils/helpers.js';
import ProductCard from '@/features/product/components/ProductCard.jsx';
import ProductSkeleton from '@/features/product/components/ProductSkeleton.jsx';
import { Building2, CheckCircle, Headphones, Heart, HelpCircle, Reply, RotateCcw, Share2, ShoppingCart, ShieldCheck, Star, Truck, Zap, BadgeCheck } from 'lucide-react';
import TopBar from '@/components/shared/TopBar';
import { useProductGallery, useProductDetailShop } from '@/features/product/hooks/useProduct';

const TABS = ["Description", "Caractéristiques", "Prix volume", "Avis", "Questions"];
const RATING_BG = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-green-500"];

function RatingStars({ rating }) {
  return <span className="flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />)}</span>;
}

export default function ProductDetailPage({ product, onClose, onAddToCart, onOpenProduct, onOpenShop }) {
  const [tab, setTab] = useState(TABS[0]);
  const [selImg, setSelImg] = useState(null);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // MODIFICATION ICI — product est maintenant le produit dynamique (API) passé par le routeur
  const { data: productGalleryRes, isPending: productGalleryLoading } = useProductGallery(product?.id)
  const { data: detailShopRes, isPending: detailShopLoading } = useProductDetailShop(product?.shop)
  
  const productGallery = productGalleryRes?.data?.results || productGalleryRes?.data || [];
  const detailShop = detailShopRes?.data?.results || detailShopRes?.data || {};

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <TopBar onBack={onClose} />
        <ProductSkeleton />
      </div>
    );
  }

  // Données construites depuis l'API via les helpers
  const pricing = getProductPricing(product);
  const badges = getProductBadges(product);
  const discountPct = getPromoDiscount(product.pricing_display);
  const detail = buildDetailFromApi(product);
  // MODIFICATION ICI — enfants du parent variant sélectionné seulement
  const currentParent = detail.parentVariants?.[selColor];
  const currentSizes = currentParent?.children?.map(c => c.value) || [];
  const mainImage = selImg !== null 
  ? productGallery[selImg]?.image 
  : (product?.image);

  const afterAdd = () => {
    onAddToCart({
      ...product,
      qty,
      selectedVariants: { color: detail.colorNames?.[selColor], size: currentSizes?.[selSize] },
      cartKey: `${product.id}-${selColor}-${selSize}`,
    });
  };

  const handleBuyNow = () => {
    afterAdd();
    onClose();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar onBack={onClose} />

      <div className="max-w-[1300px] mx-auto px-4 py-5 grid grid-cols-[580px_1fr] gap-6">
        {/* LEFT: Images */}
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
            <div className="relative" style={{ paddingTop: '66%' }}>
              <img 
                src={mainImage} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300" 
              />
              {/* MODIFICATION ICI — badges depuis l'API */}
              {badges.map((b, i) => {
                const styleMap = { sale: 'bg-red-500', hot: 'bg-orange-500', b2b: 'bg-blue-600', new: 'bg-green-600' };
                const labelMap = { sale: 'Promo', hot: 'Populaire', b2b: 'B2B', new: 'Nouveau' };
                return <span key={b.key} className={`absolute left-3 ${i > 0 ? 'top-10' : 'top-3'} ${styleMap[b.key] || 'bg-blue-600'} text-white text-[12px] font-black px-2.5 py-1 rounded-sm`}>{b.label || labelMap[b.key] || 'Nouveau'}</span>;
              })}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2.5 mb-5">
            {/* 1. BOUTON MINIATURE POUR L'IMAGE PRINCIPALE */}
            {(product?.image) && (
              <button 
                onClick={() => setSelImg(null)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${selImg === null ? 'border-orange-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={product?.image} alt="Principale" className="w-full h-20 object-cover" />
              </button>
            )}

            {/* 2. LES IMAGES SECONDAIRES DE LA GALERIE */}
            {productGalleryLoading ? (
              Array.from({ length: 4 }, (_, i) => <div key={i} className="bg-gray-200 rounded-lg h-20 animate-pulse" />)
            ) : (Array.isArray(productGallery) && productGallery.slice(0, 4).map((img, i) => (
              <button 
                key={img.id || i} 
                onClick={() => setSelImg(i)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${selImg === i ? 'border-orange-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img.image} alt="" className="w-full h-20 object-cover" />
              </button>
            )))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex gap-0 border-b border-gray-100 mb-5">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)} className={`pb-3 px-5 text-[13px] font-black transition-all border-b-2 ${tab === t ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-800'}`}>
                  {t}
                </button>
              ))}
            </div>

            {tab === 'Description' && (
              <div className="text-[14px] text-gray-600 leading-relaxed">
                <p className="mb-4">{detail.description}</p>
                <ul className="space-y-1.5">
                  {detail.descLines.map((line, i) => <li key={i} className="flex items-start gap-2"><CheckCircle size={16} className="mt-0.5 shrink-0 text-green-500" />{line}</li>)}
                </ul>
              </div>
            )}

            {tab === 'Caractéristiques' && (
              <table className="w-full text-[13px]">
                <tbody>{detail.specs.map(([label, value]) => <tr key={label} className="border-b border-gray-50"><td className="py-2.5 font-bold text-gray-500 w-44">{label}</td><td className="py-2.5 text-gray-800">{value}</td></tr>)}</tbody>
              </table>
            )}

            {tab === 'Prix volume' && (
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-[13px]">
                  <thead><tr className="bg-[#0d1b2a] text-white"><th className="py-3 px-4 text-left font-bold">Quantité</th><th className="py-3 px-4 text-left font-bold">Prix unitaire</th><th className="py-3 px-4 text-left font-bold">Économisez</th></tr></thead>
                  <tbody>{detail.volumePricing.map((vp, i) => <tr key={vp.qty} className={`border-t border-gray-50 ${vp.best ? 'bg-green-50 font-bold' : ''}`}><td className="py-3 px-4">{vp.qty}</td><td className={`py-3 px-4 font-['Barlow_Condensed'] font-black ${vp.best ? 'text-green-600 text-[17px]' : ''}`}>{formatPrice(vp.price)}</td><td className="py-3 px-4 font-black text-green-600">{vp.label}</td></tr>)}</tbody>
                </table>
              </div>
            )}

            {tab === 'Avis' && (
              <div className="space-y-4">
                <div className="flex items-center gap-6 pb-4 border-b border-gray-100">
                  <div className="text-center"><div className="font-['Barlow_Condensed'] text-[48px] font-black text-[#0d1b2a]">{product.average_rating?.toFixed(1) || '0.0'}</div><RatingStars rating={product.average_rating || 0} /><div className="text-[12px] text-gray-400">{(product.numbers_reviews || 0).toLocaleString()} avis</div></div>
                  <div className="flex-1 space-y-1.5">{detail.ratingDist.map((count, i) => <div key={i} className="flex items-center gap-2 text-[12px]"><span className="w-8 text-right text-gray-500">{5 - i}★</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${RATING_BG[i]} rounded-full transition-all`} style={{ width: `${(count / 100)}%` }} /></div><span className="w-6 text-right text-gray-400">{count}%</span></div>)}</div>
                </div>
                {detail.reviews.map((r, i) => <div key={i} className={`pb-4 ${i < detail.reviews.length - 1 ? 'border-b border-gray-50' : ''}`}><div className="flex items-center gap-2 mb-1"><RatingStars rating={r.rating} /><span className="text-[13px] font-bold text-[#0d1b2a]">{r.author}</span>{r.verified && <span className="text-[10px] bg-blue-50 text-blue-600 font-black px-1.5 py-0.5 rounded">Vérifié</span>}<span className="ml-auto text-[11px] text-gray-400">{r.date}</span></div><p className="text-[13px] text-gray-600 leading-relaxed">{r.text}</p><div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400"><button className="hover:text-orange-500 font-bold">👍 Utile ({r.helpful})</button><button className="hover:text-orange-500 font-bold">Signaler</button></div></div>)}
              </div>
            )}

            {tab === 'Questions' && <div className="space-y-4">{detail.questions.map((q, i) => <div key={i} className="pb-4 border-b border-gray-50 last:border-0"><div className="text-[14px] font-bold text-[#0d1b2a] flex items-start gap-2"><HelpCircle size={16} className="mt-0.5 shrink-0 text-orange-500" />{q.q}</div><div className="mt-2 text-[13px] text-gray-600 flex items-start gap-2 pl-6"><Reply size={14} className="mt-0.5 shrink-0 text-gray-300" />{q.a}</div></div>)}</div>}
          </div>

        </div>

        {/* RIGHT: Product Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {/* MODIFICATION ICI — badges depuis l'API */}
                {badges.length > 0 && <div className="flex gap-1.5 mb-2.5">{badges.map(b => {
                  const labelMap = { sale: 'Promo', hot: 'Populaire', b2b: 'B2B', new: 'Nouveau' };
                  return <span key={b.key} className="rounded text-[10px] font-black px-2 py-0.5 uppercase tracking-wider bg-orange-100 text-orange-600">{b.label || labelMap[b.key] || b.key}</span>;
                })}</div>}
                <h1 className="text-[20px] font-black text-[#0d1b2a] leading-tight">{product.name}</h1>
              </div>
              <button onClick={() => setFavorite(!favorite)} className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0">
                <Heart size={20} className={favorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2"><RatingStars rating={product.average_rating} /><span className="text-[12px] text-gray-500">{(product.average_rating || 0).toFixed(1)} ({(product.numbers_reviews || 0).toLocaleString()} avis)</span></div>
            <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-3"><Building2 size={13} /> Vendu par <span className="font-bold text-[#0d1b2a]">{product.shop_name}</span>{product.shop_is_verified && <span className="text-green-600 flex items-center gap-0.5"><BadgeCheck size={12} /> Vérifié</span>}</div>

            {/* Price */}
            {/* MODIFICATION ICI — prix depuis pricing_display de l'API */}
            <div className="flex items-end gap-3 mb-4"><div className="font-['Barlow_Condensed'] text-[38px] font-black text-orange-500 leading-none">{pricing.mainPrice}</div>{pricing.oldPrice && <div className="text-[16px] text-gray-400 line-through mb-1">{pricing.oldPrice}</div>}{discountPct && <span className="rounded bg-red-100 px-2 py-1 text-[12px] font-black text-red-600 mb-1">{discountPct}</span>}</div>

            {/* Volume Pricing — MODIFICATION ICI : tous les paliers affichés directement */}
            {detail.volumePricing?.length > 0 && (
              <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-[12px]">
                  <thead><tr className="bg-[#0d1b2a] text-white"><th className="py-2 px-3 text-left font-bold">Qté</th><th className="py-2 px-3 text-left font-bold">Prix u.</th><th className="py-2 px-3 text-left font-bold">Remise</th></tr></thead>
                  <tbody>{detail.volumePricing.map((vp, i) => <tr key={vp.qty} className={`border-t border-gray-100 ${vp.best ? 'bg-green-50 font-bold' : ''}`}><td className="py-1.5 px-3 text-gray-600">{vp.qty}</td><td className={`py-1.5 px-3 font-['Barlow_Condensed'] font-black ${vp.best ? 'text-green-600' : 'text-[#0d1b2a]'}`}>{formatPrice(vp.price)}</td><td className="py-1.5 px-3 font-black text-green-600">{vp.label}</td></tr>)}</tbody>
                </table>
              </div>
            )}

            {/* Colors */}
            {detail.colors?.length > 0 && <div className="mb-4"><div className="text-[13px] font-bold text-gray-500 mb-2">Couleur : <span className="text-[#0d1b2a]">{detail.colorNames[selColor]}</span></div><div className="flex gap-2">{detail.colors.map((c, i) => <button key={c} onClick={() => { setSelColor(i); setSelSize(0); }} className={`w-9 h-9 rounded-full border-2 transition-all ${i === selColor ? 'border-orange-500 scale-110' : 'border-gray-200'}`} style={{ backgroundColor: c }} />)}</div></div>}

            {/* Sizes */}
            {currentSizes?.length > 0 && <div className="mb-4"><div className="text-[13px] font-bold text-gray-500 mb-2">Taille : <span className="text-[#0d1b2a]">{currentSizes[selSize]}</span></div><div className="flex gap-2">{currentSizes.map((s, i) => <button key={s} onClick={() => setSelSize(i)} className={`px-4 py-2 rounded border text-[13px] font-bold transition-all ${i === selSize ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>{s}</button>)}</div></div>}

            {/* Stock */}
            <div className="mb-4"><div className="flex justify-between text-[12px] mb-1"><span className="text-gray-500">Disponibilité</span><span className="font-bold text-green-600">{detail.stock > 0 ? `${detail.stock} en stock` : 'Épuisé'}</span></div>{detail.stock > 0 && <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: `${Math.min((detail.stock / 100) * 100, 100)}%` }} /></div>}</div>

            {/* Qty + Add to Cart + Buy Now */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border border-gray-200 rounded">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 text-gray-500 hover:text-orange-500 font-bold">−</button>
                <span className="px-4 py-2.5 text-[14px] font-black border-x border-gray-200">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2.5 text-gray-500 hover:text-orange-500 font-bold">+</button>
              </div>
              <button onClick={afterAdd} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded text-[14px] font-black transition-colors flex items-center justify-center gap-2" disabled={detail.stock === 0}>
                <ShoppingCart size={16} /> Ajouter
              </button>
              <button onClick={handleBuyNow} className="bg-[#0d1b2a] hover:bg-[#1a2e45] text-white py-3 px-5 rounded text-[14px] font-black transition-colors flex items-center justify-center gap-2 shrink-0" disabled={detail.stock === 0}>
                <Zap size={16} /> Acheter
              </button>
            </div>

            {/* Delivery info */}
            <div className="rounded-lg bg-gray-50 p-4 grid grid-cols-2 gap-3 text-[12px]">
              <div className="flex items-center gap-2"><Truck size={16} className="text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Livraison</div><div className="text-gray-400">Dakar: 24h · National: 72h</div></div></div>
              <div className="flex items-center gap-2"><RotateCcw size={16} className="text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Retour</div><div className="text-gray-400">15 jours satisfait ou remboursé</div></div></div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Paiement</div><div className="text-gray-400">Wave, OM, Visa, PayPal</div></div></div>
              <div className="flex items-center gap-2"><Headphones size={16} className="text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Support</div><div className="text-gray-400">Chat & WhatsApp 24/7</div></div></div>
            </div>
          </div>

          {/* Supplier card — MODIFICATION ICI : données de la boutique via l'API */}
          <div className={`bg-white rounded-lg shadow-sm p-5 ${detailShopLoading ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <img src={detailShop.logo} alt="" className="w-12 h-12 rounded object-cover" />
              <div>
                <div className="text-[13px] font-black text-[#0d1b2a]">{detailShop.name || product.shop_name}</div>
                <div className="text-[11px] text-gray-400">{detailShop.address || ''}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-[11px]">
              {[
                ['Vendeur depuis', detailShop.date_created ? new Date(detailShop.date_created).getFullYear().toString() : '-'],
                ['Produits', (detailShop.total_products || 0).toLocaleString()],
                ['Ventes', (detailShop.number_sale || 0).toLocaleString()],
              ].map(([label, value]) => <div key={label} className="rounded bg-gray-50 p-2"><div className="font-black text-[#0d1b2a] text-[12px]">{value}</div><div className="text-gray-400">{label}</div></div>)}
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 rounded border border-orange-300 py-2.5 text-[12px] font-bold text-orange-500 hover:bg-orange-50 transition-colors">Contacter</button>
              {/* MODIFICATION ICI — navigation vers la page boutique */}
              <button onClick={() => onOpenShop?.(product.shop)} className="flex-1 rounded bg-[#0d1b2a] py-2.5 text-[12px] font-bold text-white hover:bg-orange-500 transition-colors">Voir le shop</button>
              <button className="flex-1 rounded bg-orange-500 py-2.5 text-[12px] font-bold text-white hover:bg-orange-600 transition-colors">Devis</button>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-[13px] font-bold text-gray-500 mb-3 flex items-center gap-2">
              <Share2 size={14} /> Partager
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#1877F2] text-white text-[12px] font-bold hover:opacity-90 transition-opacity">
                <span className="text-[14px]">f</span> Facebook
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-black text-white text-[12px] font-bold hover:opacity-90 transition-opacity">
                <span className="text-[14px]">X</span> Twitter
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#25D366] text-white text-[12px] font-bold hover:opacity-90 transition-opacity">
                <span className="text-[14px]">📱</span> WhatsApp
              </button>
            </div>
          </div>

          {/* Quick specs */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-[15px] font-black text-[#0d1b2a] mb-3">Aperçu rapide</div>
            <div className="space-y-2 text-[12px]">{detail.specs.slice(0, 4).map(([label, value]) => <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0"><span className="text-gray-500">{label}</span><span className="font-bold text-[#0d1b2a]">{value}</span></div>)}</div>
            {detail.specs.length > 4 && <button onClick={() => setExpanded(!expanded)} className="mt-2 text-[12px] font-black text-orange-500 hover:underline">{expanded ? 'Voir moins' : `Voir +${detail.specs.length - 4} caractéristiques`}</button>}
            {expanded && <div className="mt-2 space-y-2 text-[12px]">{detail.specs.slice(4).map(([label, value]) => <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0"><span className="text-gray-500">{label}</span><span className="font-bold text-[#0d1b2a]">{value}</span></div>)}</div>}
          </div>
        </div>
      </div>

      {/* Related - full width */}
      {featuredProducts.length > 0 && (
        <div className="max-w-[1300px] mx-auto px-4 pb-5">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="font-['Barlow_Condensed'] text-[20px] font-black text-[#0d1b2a] mb-4">Vous aimerez aussi</div>
            <div className="grid grid-cols-5 gap-2.5">
              {featuredProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
