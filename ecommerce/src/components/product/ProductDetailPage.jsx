import { useState } from 'react';
import { productDetails, buildDefaultDetail, formatPrice, featuredProducts } from '../../data/data.js';
import ProductCard from './ProductCard.jsx';
import Icon from '../shared/Icon.jsx';

export default function ProductDetailPage({ product, onClose, onAddToCart, onOpenProduct }) {
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        <div className="max-w-md rounded-xl bg-white p-8 shadow-sm text-center">
          <div className="text-lg font-bold mb-2">Produit introuvable</div>
          <p className="text-sm text-gray-500">Nous n'avons pas pu charger ce produit. Retournez à l'accueil ou choisissez un autre article.</p>
        </div>
      </div>
    );
  }

  const detail = productDetails[product.id] || buildDefaultDetail(product);
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(1);
  const [activeSize, setActiveSize] = useState(1);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [wished, setWished] = useState(false);
  const [question, setQuestion] = useState('');
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'specs', label: 'Caractéristiques' },
    { key: 'reviews', label: `Avis (${detail.reviews.length})` },
    { key: 'questions', label: 'Questions & Réponses' },
  ];

  const avgRating = (detail.reviews.reduce((s, r) => s + r.rating, 0) / detail.reviews.length).toFixed(1);
  const related = featuredProducts.filter(p => p.id !== product.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Close bar */}
      <div className="bg-[#0d1b2a] px-4 py-2.5 flex items-center justify-between sticky top-0 z-10">
        <div className="font-['Barlow_Condensed'] text-2xl font-black text-white">
          Trade<span className="text-orange-500">Hub</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-300 hover:text-white text-[13px] px-3.5 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Icon name="arrowLeft" /> Retour au catalogue
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-2.5">
        <div className="max-w-[1300px] mx-auto px-4 flex items-center gap-1.5 text-[12px] text-gray-400">
          <button onClick={onClose} className="text-blue-500 hover:underline">Accueil</button>
          <span>›</span>
          <span className="text-blue-500 hover:underline cursor-pointer">Électronique</span>
          <span>›</span>
          <span className="text-[#0d1b2a] truncate">{product.name.slice(0, 50)}…</span>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 pt-4">
        {/* Top grid: gallery | info | supplier */}
        <div className="grid grid-cols-[420px_1fr_260px] gap-4 mb-4">

          {/* === GALLERY === */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div
              className="relative rounded overflow-hidden border border-gray-100 bg-gray-50 mb-2.5"
              style={{ paddingTop: '100%' }}
              onMouseEnter={() => setHoverZoom(true)}
              onMouseLeave={() => setHoverZoom(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPos({ x, y });
              }}
            >
              <img
                src={detail.images[activeImg]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-300"
                style={{
                  transform: hoverZoom ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
              {product.discount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-sm uppercase z-10">
                  {product.discount}
                </span>
              )}

              {/* Hover zoom indicator */}
              {hoverZoom && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-bold z-20">
                  🔍 2x Zoom
                </div>
              )}

              <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                {[
                  { icon: 'magnifyPlus', action: () => setZoomOpen(true) },
                  { icon: 'heart', action: () => setWished(!wished), active: wished },
                  { icon: 'share', action: null },
                ].map(({ icon, action, active }, i) => (
                  <button
                    key={i}
                    onClick={action}
                    className={`w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[14px] hover:bg-orange-500 hover:text-white transition-colors ${active ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <Icon name={icon} size={14} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {detail.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 shrink-0 rounded border-2 overflow-hidden cursor-pointer transition-colors bg-gray-50 ${i === activeImg ? 'border-orange-500' : 'border-gray-200 hover:border-orange-300'}`}
                >
                  <img src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* === PRODUCT INFO === */}
          <div className="bg-white rounded-lg p-5 shadow-sm overflow-y-auto">
            <div className="text-[12px] text-blue-500 font-bold mb-1.5 cursor-pointer hover:underline">{detail.supplier.name}</div>
            <h1 className="text-[20px] font-black text-[#0d1b2a] leading-tight mb-3">{product.name}</h1>

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="text-yellow-400 text-[15px] tracking-[-1px]">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
              <span className="text-[13px] font-bold text-[#0d1b2a]">{product.rating}</span>
              <button onClick={() => setActiveTab('reviews')} className="text-[12px] text-blue-500 hover:underline">({product.reviews.toLocaleString()} avis)</button>
              <span className="text-[12px] text-gray-400">| {(product.reviews * 3).toLocaleString()} vendus</span>
              {product.verified && (
                <span className="bg-green-50 text-green-600 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Icon name="circleCheck" size={12} /> Vendeur Vérifié
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r px-4 py-3 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="font-['Barlow_Condensed'] text-[38px] font-black text-orange-500 leading-none">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="text-[16px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
              </div>
              {product.oldPrice && (
                <div className="text-[13px] text-red-500 font-bold mt-1">
                  Vous économisez {formatPrice(product.oldPrice - product.price)} ({product.discount})
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded"><Icon name="box" size={12} className="mr-1" />À partir de 1 unité</span>
                <span className="bg-green-50 text-green-600 text-[11px] font-bold px-2 py-0.5 rounded"><Icon name="truck" size={12} className="mr-1" />Livraison gratuite dès 3 unités</span>
              </div>
            </div>

            {/* Volume pricing */}
            <div className="text-[13px] font-bold text-[#0d1b2a] mb-2 flex items-center gap-1.5">
              <Icon name="chartLine" className="text-orange-500" /> Prix dégressifs
            </div>
            <table className="w-full text-[12px] mb-4 rounded overflow-hidden">
              <thead>
                <tr>
                  {['Quantité', 'Prix unitaire', 'Remise'].map(h => (
                    <th key={h} className="bg-[#0d1b2a] text-white px-3 py-2 text-left font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.volumePricing.map((vp, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-2 border-b border-gray-100">{vp.qty}</td>
                    <td className={`px-3 py-2 border-b border-gray-100 font-${vp.best ? 'black text-green-600' : 'medium'}`}>{formatPrice(vp.price)}{vp.best ? ' 🏆' : ''}</td>
                    <td className="px-3 py-2 border-b border-gray-100 text-gray-400">{vp.label || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Color */}
            <div className="text-[13px] font-bold text-[#0d1b2a] mb-2">
              Couleur : <span className="font-medium">{detail.colorNames[activeColor]}</span>
            </div>
            <div className="flex gap-2 mb-4">
              {detail.colors.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setActiveColor(i)}
                  title={detail.colorNames[i]}
                  className={`w-8 h-8 rounded-full cursor-pointer shadow transition-transform hover:scale-110 ${i === activeColor ? 'ring-2 ring-orange-500 ring-offset-2 scale-110' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </div>

            {/* Size */}
            <div className="text-[13px] font-bold text-[#0d1b2a] mb-2">Stockage / Taille</div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {detail.sizes.map((s, i) => {
                const out = detail.outOfStock?.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => !out && setActiveSize(i)}
                    className={`px-3.5 py-1.5 border-[1.5px] rounded text-[13px] font-semibold transition-all ${out ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through' : i === activeSize ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-200 text-[#0d1b2a] hover:border-orange-300'}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Qty & stock */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border-[1.5px] border-gray-200 rounded overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-[16px] font-bold transition-colors">−</button>
                <input
                  type="number"
                  value={qty}
                  min="1"
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 h-9 text-center text-[15px] font-bold border-none outline-none"
                />
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-[16px] font-bold transition-colors">+</button>
              </div>
              <span className={`text-[12px] font-semibold flex items-center gap-1 ${detail.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                <Icon name={detail.stock < 10 ? 'circleAlert' : 'circleCheck'} size={12} />
                {detail.stock < 10 ? `Plus que ${detail.stock} en stock !` : `${detail.stock} en stock`}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2.5 mb-4">
              <button
                onClick={() => { onAddToCart(product); onClose(); }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 font-black text-[15px] rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Icon name="cartAdd" /> Ajouter au panier
              </button>
              <button className="flex-1 bg-[#0d1b2a] hover:bg-[#1a2e45] text-white py-3 font-black text-[15px] rounded flex items-center justify-center gap-2 transition-colors">
                <Icon name="bolt" /> Acheter maintenant
              </button>
              <button
                onClick={() => setWished(!wished)}
                className={`w-12 h-12 border-[1.5px] rounded flex items-center justify-center text-[18px] transition-colors ${wished ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-300 hover:border-red-400'}`}
              >
                <Icon name="heart" />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-blue-50 rounded border border-blue-100 mb-4">
              {[
                { icon: 'shield', text: 'Paiement 100% sécurisé' },
                { icon: 'rotateLeft', text: 'Retour sous 15 jours' },
                { icon: 'truckFast', text: 'Livraison Dakar 24h' },
                { icon: 'headset', text: 'Support dédié 7j/7' },
              ].map(g => (
                <div key={g.text} className="flex items-center gap-2 text-[11px] text-gray-600">
                  <Icon name={g.icon} size={13} className="text-green-600" /> {g.text}
                </div>
              ))}
            </div>

            {/* Share row */}
            <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
              <span className="text-[12px] text-gray-400">Partager :</span>
              {[{ icon: 'facebook', bg: 'bg-[#1877f2]' }, { icon: 'xTwitter', bg: 'bg-black' }, { icon: 'whatsapp', bg: 'bg-[#25d366]' }, { icon: 'link', bg: 'bg-gray-500' }].map(s => (
                <div key={s.icon} className={`w-7 h-7 ${s.bg} rounded-full flex items-center justify-center text-white text-[12px] cursor-pointer hover:opacity-80 transition-opacity`}>
                  <Icon name={s.icon} size={12} />
                </div>
              ))}
              <button className="ml-auto text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="flag" size={12} className="mr-1" /> Signaler
              </button>
            </div>
          </div>

          {/* === SUPPLIER PANEL === */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3 pb-3.5 mb-3.5 border-b border-gray-100">
              <img src={detail.supplier.logo} alt={detail.supplier.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
              <div>
                <div className="text-[14px] font-black text-[#0d1b2a] mb-0.5">{detail.supplier.name}</div>
                <div className="text-[11px] text-gray-400 leading-relaxed">
                  {detail.supplier.location}<br />
                  {'★'.repeat(Math.floor(detail.supplier.rating))} {detail.supplier.rating}/5<br />
                  Membre depuis {detail.supplier.since}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { val: detail.supplier.transactions, label: 'Transactions' },
                { val: detail.supplier.responseRate, label: 'Taux réponse' },
                { val: detail.supplier.responseTime, label: 'Délai réponse' },
                { val: '4.8★', label: 'Note globale' },
              ].map(s => (
                <div key={s.label} className="text-center p-2.5 bg-gray-50 rounded">
                  <div className="font-['Barlow_Condensed'] text-[18px] font-black text-[#0d1b2a]">{s.val}</div>
                  <div className="text-[10px] text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-2.5 text-[13px] font-bold rounded flex items-center justify-center gap-2 transition-colors mb-2">
              <Icon name="message" /> Contacter le vendeur
            </button>
            <button className="w-full bg-[#0d1b2a] hover:bg-[#1a2e45] text-white py-2.5 text-[13px] font-bold rounded flex items-center justify-center gap-2 transition-colors">
              <Icon name="fileInvoice" /> Demander un devis
            </button>

            {/* Delivery */}
            <div className="mt-3 border border-gray-100 rounded overflow-hidden">
              {[
                { icon: 'truckFast', title: 'Livraison Standard', desc: 'Dakar : 1–2 jours · 2 500 FCFA' },
                { icon: 'bolt', title: 'Livraison Express', desc: 'Même jour avant 20h · 5 000 FCFA' },
                { icon: 'globe', title: 'Sous-région', desc: 'Mali, Gambie… 7–14 jours' },
                { icon: 'shield', title: 'Protection Acheteur', desc: 'Remboursement si non conforme' },
              ].map((d, i) => (
                <div key={i} className="flex gap-2.5 p-2.5 border-b border-gray-50 last:border-b-0 text-[12px]">
                  <Icon name={d.icon} size={14} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0d1b2a]">{d.title}</div>
                    <div className="text-gray-400">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === TABS === */}
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="flex border-b-2 border-gray-100 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-6 py-3.5 text-[14px] font-bold whitespace-nowrap border-b-2 -mb-[2px] transition-colors ${activeTab === t.key ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-[#0d1b2a]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Description */}
            {activeTab === 'description' && (
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-4">{detail.description}</p>
                  <ul className="space-y-2.5">
                    {detail.descLines.map((l, i) => (
                      <li key={i} className="flex gap-2.5 text-[13px] text-gray-600">
                        <Icon name="check" size={14} className="text-green-500 mt-0.5" /> {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-black text-[14px] text-[#0d1b2a] mb-3">Contenu de la boîte</div>
                  {['1× Produit principal', '1× Câble USB-C', '1× Documentation', '1× Garantie internationale'].map((it, i) => (
                    <div key={i} className="flex gap-2 text-[13px] text-gray-600 mb-2">
                      <Icon name="packageOpen" className="text-orange-500" /> {it}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            {activeTab === 'specs' && (
              <table className="w-full text-[13px]">
                <tbody>
                  {detail.specs.map(([k, v], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2.5 border-b border-gray-100 font-bold text-[#0d1b2a] w-[40%]">{k}</td>
                      <td className="px-3 py-2.5 border-b border-gray-100 text-gray-600">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex gap-8 mb-6">
                  <div className="text-center bg-orange-50 border border-orange-100 rounded-lg p-5 shrink-0">
                    <div className="font-['Barlow_Condensed'] text-[54px] font-black text-orange-500 leading-none">{avgRating}</div>
                    <div className="text-yellow-400 text-[18px] my-1">{'★'.repeat(Math.round(avgRating))}</div>
                    <div className="text-[12px] text-gray-400">{product.reviews.toLocaleString()} avis</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star, i) => (
                      <div key={star} className="flex items-center gap-2.5 text-[12px]">
                        <span className="text-gray-400 w-8 text-right">{star}★</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${detail.ratingDist[i]}%` }} />
                        </div>
                        <span className="text-gray-400 w-7">{detail.ratingDist[i]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {detail.reviews.map((r, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[14px] font-black shrink-0 ${['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500'][i % 4]}`}>
                            {r.author[0]}
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-[#0d1b2a] flex items-center gap-2">
                              {r.author}
                              {r.verified && <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">✓ Achat vérifié</span>}
                            </div>
                            <div className="text-[11px] text-gray-400">{r.date}</div>
                          </div>
                        </div>
                        <span className="text-yellow-400 text-[13px]">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-relaxed mb-2">{r.text}</p>
                      <div className="text-[11px] text-gray-400 flex items-center gap-3">
                        <span>{r.helpful} personnes ont trouvé cet avis utile</span>
                        <button className="text-blue-500">👍 Utile</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            {activeTab === 'questions' && (
              <div>
                <div className="flex gap-2.5 mb-5">
                  <input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Posez votre question au vendeur…"
                    className="flex-1 border-[1.5px] border-gray-200 focus:border-orange-500 rounded px-3.5 py-2.5 text-[13px] outline-none transition-colors"
                  />
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-[13px] font-bold flex items-center gap-1.5 transition-colors">
                    <Icon name="paperPlane" /> Envoyer
                  </button>
                </div>
                <div className="space-y-3">
                  {detail.questions.map((q, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 text-[13px] font-bold text-[#0d1b2a] flex gap-2.5">
                        <Icon name="circleQuestion" className="text-orange-500 mt-0.5" /> {q.q}
                      </div>
                      <div className="px-4 py-3 text-[13px] text-gray-600 leading-relaxed flex gap-2.5">
                        <Icon name="commentDots" className="text-blue-400 mt-0.5" /> {q.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-['Barlow_Condensed'] text-[22px] font-black text-[#0d1b2a] flex items-center gap-2.5 before:content-[''] before:w-1 before:h-5 before:bg-orange-500 before:rounded">
              Produits Similaires
            </div>
            <span className="text-[13px] text-orange-500 font-semibold cursor-pointer hover:underline flex items-center gap-1">
              Voir tout <Icon name="arrowRight" size={14} />
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {related.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} />
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Aperçu zoomé</h2>
              <button
                onClick={() => setZoomOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            {/* Zoom Container */}
            <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-100 relative">
              <img
                src={detail.images[activeImg]}
                alt={product.name}
                className="transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            {/* Controls */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 bg-orange-100 text-orange-600 font-bold rounded min-w-[80px] text-center">
                  {(zoomLevel * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(4, zoomLevel + 0.5))}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition-colors"
                >
                  +
                </button>
              </div>

              {/* Image selector */}
              <div className="flex gap-2">
                {detail.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveImg(i);
                      setZoomLevel(1);
                    }}
                    className={`w-12 h-12 rounded border-2 overflow-hidden transition-colors ${
                      i === activeImg ? 'border-orange-500' : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    <img src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
