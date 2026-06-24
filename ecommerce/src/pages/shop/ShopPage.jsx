import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetailShop } from '@/features/product/hooks/useProduct';
import { useProducts } from '@/features/product/hooks/useProduct';
import { useCart } from '@/features/cart/hooks/useCart';
import ProductCard from '@/features/product/components/ProductCard.jsx';
import TopBar from '@/components/shared/TopBar';
import { BadgeCheck, Building2, Package, ShoppingBag, Users, Star, Mail, Phone, MapPin, Clock, Truck, RotateCcw } from 'lucide-react';

export default function ShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: shopRes } = useProductDetailShop(id);
  const shop = shopRes?.data?.results || shopRes?.data || {};

  const { data: productsRes } = useProducts({ shop: id });
  const products = productsRes?.data?.results || productsRes?.data || [];

  const stats = [
    { icon: Package, label: 'Produits', value: shop.total_products || 0 },
    { icon: ShoppingBag, label: 'Ventes', value: (shop.number_sale || 0).toLocaleString() },
    { icon: Users, label: 'Abonnés', value: (shop.total_followers || 0).toLocaleString() },
    { icon: Clock, label: 'Membre depuis', value: shop.date_created ? new Date(shop.date_created).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : '-' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar onBack={() => navigate(-1)} />

      <div className="max-w-[1300px] mx-auto px-4 py-6 space-y-6">
        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-5">
            <img
              src={shop.logo || 'https://via.placeholder.com/100'}
              alt={shop.name}
              className="w-24 h-24 rounded-xl object-cover border border-gray-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[22px] font-black text-[#0d1b2a] truncate">{shop.name}</h1>
                {shop.is_verifted && (
                  <span className="text-green-600 flex items-center gap-0.5 text-[13px] font-bold"><BadgeCheck size={16} /> Vérifié</span>
                )}
                {shop.is_top_seller && (
                  <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Top Vendeur</span>
                )}
              </div>
              {shop.description && (
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3 line-clamp-2">{shop.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-gray-500">
                {shop.address && <span className="flex items-center gap-1"><MapPin size={13} /> {shop.address}</span>}
                {shop.email_contact && <span className="flex items-center gap-1"><Mail size={13} /> {shop.email_contact}</span>}
                {shop.phone_number && <span className="flex items-center gap-1"><Phone size={13} /> {shop.phone_number}</span>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon size={18} className="mx-auto mb-1 text-orange-500" />
                <div className="font-black text-[#0d1b2a] text-[16px]">{value}</div>
                <div className="text-[11px] text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Policies */}
        {(shop.delivery_conditions || shop.return_policy || shop.free_shipping || shop.delivery_time_estimate) && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-[15px] font-black text-[#0d1b2a] mb-3">Informations boutique</h2>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              {shop.delivery_conditions && (
                <div className="flex items-start gap-2"><Truck size={16} className="mt-0.5 shrink-0 text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Livraison</div><div className="text-gray-600">{shop.delivery_conditions}</div></div></div>
              )}
              {shop.return_policy && (
                <div className="flex items-start gap-2"><RotateCcw size={16} className="mt-0.5 shrink-0 text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Retours</div><div className="text-gray-600">{shop.return_policy}</div></div></div>
              )}
              {shop.free_shipping && (
                <div className="flex items-start gap-2"><Truck size={16} className="mt-0.5 shrink-0 text-green-500" /><div><div className="font-bold text-green-600">Livraison gratuite</div></div></div>
              )}
              {shop.delivery_time_estimate && (
                <div className="flex items-start gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Délai estimé</div><div className="text-gray-600">{shop.delivery_time_estimate}</div></div></div>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        {shop.categories_details?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-[15px] font-black text-[#0d1b2a] mb-3">Catégories</h2>
            <div className="flex flex-wrap gap-2">
              {shop.categories_details.map(cat => (
                <span key={cat.id} className="bg-gray-100 text-[#0d1b2a] text-[12px] font-bold px-3 py-1.5 rounded-full">{cat.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-[15px] font-black text-[#0d1b2a] mb-4">Produits de la boutique ({shop.total_products || 0})</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-5 gap-2.5">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={(prod) => addToCart(prod, false)}
                  onOpenProduct={(prod) => navigate(`/product/${prod.id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 text-center py-8">Aucun produit pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
}
