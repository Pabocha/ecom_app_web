import { formatPrice } from '@/data/data.js';
import { Loader, X } from 'lucide-react';

function variantLabel(selection) {
  return Object.entries(selection).map(([key, value]) => `${key}: ${value}`).join(' · ');
}

// Version dynamique qui utilise raw (arbre) ou fallback flat
export default function VariantModal({ product, selection, raw, loading, onSelectionChange, onConfirm, onClose }) {
  if (!product) return null;

  const hasTree = raw?.structure?.length > 0 && raw?.variants?.length > 0;

  // Options disponibles à un niveau donné (contrainte par sélections parentes)
  function getOptionsAtLevel(rawData, sel, level) {
    const { structure, variants } = rawData;
    let nodes = variants;
    for (let i = 0; i < level; i++) {
      const attrCode = structure[i];
      const val = sel[attrCode];
      if (!val) break;
      const node = (nodes || []).find(n => n.value === val);
      if (!node?.children) break;
      nodes = node.children;
    }
    const attrCode = structure[level];
    return (nodes || []).map(n => {
      let leaf = n;
      while (leaf?.children?.length) leaf = leaf.children[0];
      const hex = leaf?.attributes?.find(a => a.attribute_code === attrCode)?.hex_color || null;
      return { value: n.value, hexColor: hex };
    });
  }

  // MODIFICATION ICI — Récupère le nom d'attribut français depuis n'importe quelle feuille
  function getAttrName(rawData, attrCode) {
    function walk(nodes) {
      if (!nodes) return null;
      for (const n of nodes) {
        if (n.attributes) {
          const attr = n.attributes.find(a => a.attribute_code === attrCode);
          if (attr) return attr.attribute_name;
        }
        if (n.children) {
          const found = walk(n.children);
          if (found) return found;
        }
      }
      return null;
    }
    return walk(rawData?.variants) || attrCode;
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header avec état loading */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex gap-3">
            <img src={product.img} alt={product.name} className="h-20 w-20 rounded object-cover" />
            <div>
              <div className="text-[16px] font-black text-[#0d1b2a]">{product.name}</div>
              {loading ? (
                <div className="mt-1 flex items-center gap-2 text-[13px] text-gray-400">
                  <Loader size={14} className="animate-spin" /> Chargement...
                </div>
              ) : (
                <>
                  <div className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(product.price)}</div>
                  <div className="text-[12px] text-gray-400">Choisissez vos options avant l'ajout.</div>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose} className="rounded bg-gray-100 p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
        </div>

        {/* MODIFICATION ICI — Sélecteurs dynamiques : TOUS les niveaux affichés avec leurs options */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-gray-300" />
          </div>
        ) : hasTree ? (
          <div className="space-y-5 p-5">
            {raw.structure.map((attrCode, levelIndex) => {
              const attrName = getAttrName(raw, attrCode);
              const options = getOptionsAtLevel(raw, selection, levelIndex);
              const selectedVal = selection[attrCode];
              const hasHex = options.some(o => o.hexColor);

              return (
                <div key={attrCode}>
                  <div className="mb-2 text-[13px] font-black uppercase text-[#0d1b2a]">{attrName}</div>
                  <div className="flex flex-wrap gap-2">
                    {options.map(opt => {
                      if (hasHex) {
                        return (
                          <button
                            key={opt.value}
                            onClick={() => onSelectionChange(attrCode, opt.value)}
                            className={`w-9 h-9 rounded-full border-2 transition-all ${selectedVal === opt.value ? 'border-orange-500 scale-110' : 'border-gray-200 hover:border-orange-300'}`}
                            style={{ backgroundColor: opt.hexColor || '#ccc' }}
                            title={opt.value}
                          />
                        );
                      }
                      return (
                        <button
                          key={opt.value}
                          onClick={() => onSelectionChange(attrCode, opt.value)}
                          className={`rounded border px-4 py-2 text-[13px] font-bold transition-all ${
                            selectedVal === opt.value
                              ? 'border-orange-500 bg-orange-50 text-orange-500'
                              : 'border-gray-200 text-gray-600 hover:border-orange-300'
                          }`}
                        >
                          {opt.value}
                        </button>
                      );
                    })}
                    {options.length === 0 && (
                      <div className="text-[12px] text-gray-400 italic">Aucune option disponible</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback flat (legacy) */
          <div className="space-y-4 p-5">
            {Object.entries(product.variants || {}).map(([variantName, values]) => (
              <div key={variantName}>
                <div className="mb-2 text-[13px] font-black uppercase text-[#0d1b2a]">{variantName}</div>
                <div className="flex flex-wrap gap-2">
                  {values.map(value => (
                    <button
                      key={value}
                      onClick={() => onSelectionChange(variantName, value)}
                      className={`rounded border px-3 py-2 text-[13px] font-bold transition-colors ${selection[variantName] === value ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-5">
            <div className="text-[12px] text-gray-500">
              Sélection : <span className="font-black text-[#0d1b2a]">{variantLabel(selection) || '—'}</span>
            </div>
            <button onClick={onConfirm} className="rounded bg-orange-500 px-5 py-3 text-[13px] font-black text-white hover:bg-orange-600">
              Ajouter au panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
