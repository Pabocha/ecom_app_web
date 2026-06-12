import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../shared/Icon.jsx";
import CategorySelectorModal from "./CategorySelectorModal.jsx";

const actionPopovers = [
  {
    icon: "heart",
    label: "Favoris",
    title: "Vos favoris",
    text: "Gardez vos produits et fournisseurs préférés sous la main.",
    primary: "Voir les favoris",
    secondary: "Collections",
    links: ["Produits sauvegardés", "Vendeurs suivis"],
  },
  {
    icon: "box",
    label: "Commandes",
    title: "Suivi commandes",
    text: "Retrouvez vos commandes, retours, factures et demandes de devis.",
    primary: "Mes commandes",
    secondary: "Suivre un colis",
    links: ["Retours", "Factures"],
  },
];

export default function TopNav({ cartCount, onCartOpen, user, onLogout }) {
  const navigate = useNavigate();
  const [searchTab, setSearchTab] = useState("Produits");
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchTab}`);
      setSearchQuery('');
    }
  };

  const handleSelectCategory = (subcat) => {
    navigate(`/search?q=${encodeURIComponent(subcat)}&type=Produits`);
  };

  return (
    <div className="bg-[#0d1b2a] py-3.5 px-4">
      <div className="max-w-[1300px] mx-auto flex items-center gap-4">
        {/* Logo */}
        <div className="font-['Barlow_Condensed'] text-3xl font-black text-white tracking-tight shrink-0">
          Trade<span className="text-orange-500">Hub</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[680px]">
          <div className="flex gap-0 mb-1.5">
            {["Produits", "Fournisseurs", "RFQ"].map((t) => (
              <span
                key={t}
                onClick={() => setSearchTab(t)}
                className={`text-[12px] pr-2.5 cursor-pointer transition-colors ${
                  searchTab === t
                    ? "text-orange-500 font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span
                  className={`inline-block ${searchTab === t ? "border-b-2 border-orange-500" : "border-b-2 border-transparent"}`}
                >
                  {t}
                </span>
              </span>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex bg-white rounded overflow-hidden">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(true)}
              className="px-3 text-[13px] text-gray-700 border-r border-gray-200 flex items-center gap-1 bg-gray-100 whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Toutes catégories <Icon name="chevronDown" size={12} />
            </button>
            <input
              className="flex-1 border-none outline-none px-3.5 py-2.5 text-[14px] text-gray-800"
              placeholder={`Rechercher des ${searchTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 text-[15px] transition-colors">
              <Icon name="search" />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Account - Logged In or Not */}
          <div className="relative group">
            <button className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white rounded hover:bg-white/10 transition-colors">
              <Icon name="user" size={18} className="text-orange-300" />
              <span className="text-[11px]">Compte</span>
            </button>

            <div className="pointer-events-none absolute left-1/2 top-full z-[700] mt-3 w-[260px] -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white shadow-[-2px_-2px_4px_rgba(0,0,0,0.04)]" />
              <div className="relative overflow-hidden rounded-md bg-white text-[#0d1b2a] shadow-2xl shadow-black/30 ring-1 ring-black/5">
                {user ? (
                  <>
                    <div className="border-b border-gray-100 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                          <Icon name="user" size={17} />
                        </span>
                        <div>
                          <div className="text-[14px] font-black">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-[11px] text-gray-400">{user.email || user.phone_number}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3">
                      <button
                        onClick={() => navigate('/profile')}
                        className="rounded bg-orange-500 px-3 py-2 text-[12px] font-black text-white hover:bg-orange-600"
                      >
                        Mon profil
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          navigate('/');
                        }}
                        className="rounded border border-red-300 px-3 py-2 text-[12px] font-bold text-red-600 hover:bg-red-50"
                      >
                        Déconnexion
                      </button>
                    </div>

                    <div className="grid divide-y divide-gray-100 border-t border-gray-100">
                      <a href="#" className="flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-500">
                        Mes informations
                        <Icon name="chevronRight" size={12} />
                      </a>
                      <a href="#" className="flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-500">
                        Mes commandes
                        <Icon name="chevronRight" size={12} />
                      </a>
                      <a href="#" className="flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-500">
                        Centre vendeur
                        <Icon name="chevronRight" size={12} />
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-b border-gray-100 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                          <Icon name="user" size={17} />
                        </span>
                        <div>
                          <div className="text-[14px] font-black">Bienvenue sur TradeHub</div>
                          <div className="text-[11px] text-gray-400">Compte</div>
                        </div>
                      </div>
                      <p className="mt-2 text-[12px] leading-relaxed text-gray-500">
                        Connectez-vous pour suivre vos achats, vos devis et vos fournisseurs.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3">
                      <button
                        onClick={() => navigate('/login')}
                        className="rounded bg-orange-500 px-3 py-2 text-[12px] font-black text-white hover:bg-orange-600"
                      >
                        Se connecter
                      </button>
                      <button
                        onClick={() => navigate('/signup')}
                        className="rounded border border-gray-200 px-3 py-2 text-[12px] font-bold text-gray-600 hover:border-orange-300 hover:text-orange-500"
                      >
                        S'inscrire
                      </button>
                    </div>

                    <div className="grid divide-y divide-gray-100 border-t border-gray-100">
                      <a href="#" className="flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-500">
                        Mes informations
                        <Icon name="chevronRight" size={12} />
                      </a>
                      <a href="#" className="flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-500">
                        Centre vendeur
                        <Icon name="chevronRight" size={12} />
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Other Popovers */}
          {actionPopovers.map(({ icon, label, title, text, primary, secondary, links }) => (
            <div key={label} className="relative group">
              <button className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white rounded hover:bg-white/10 transition-colors">
                <Icon name={icon} size={18} className="text-orange-300" />
                <span className="text-[11px]">{label}</span>
              </button>

              <div className="pointer-events-none absolute left-1/2 top-full z-[700] mt-3 w-[260px] -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white shadow-[-2px_-2px_4px_rgba(0,0,0,0.04)]" />
                <div className="relative overflow-hidden rounded-md bg-white text-[#0d1b2a] shadow-2xl shadow-black/30 ring-1 ring-black/5">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                        <Icon name={icon} size={17} />
                      </span>
                      <div>
                        <div className="text-[14px] font-black">{title}</div>
                        <div className="text-[11px] text-gray-400">{label}</div>
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-gray-500">{text}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3">
                    <button className="rounded bg-orange-500 px-3 py-2 text-[12px] font-black text-white hover:bg-orange-600">
                      {primary}
                    </button>
                    <button className="rounded border border-gray-200 px-3 py-2 text-[12px] font-bold text-gray-600 hover:border-orange-300 hover:text-orange-500">
                      {secondary}
                    </button>
                  </div>

                  <div className="grid divide-y divide-gray-100 border-t border-gray-100">
                    {links.map((link) => (
                      <a key={link} href="#" className="flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-500">
                        {link}
                        <Icon name="chevronRight" size={12} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white rounded hover:bg-white/10 transition-colors relative"
          >
            <Icon name="cart" size={18} className="text-orange-300" />
            <span className="text-[11px]">Panier</span>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Selector Modal */}
      <CategorySelectorModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
