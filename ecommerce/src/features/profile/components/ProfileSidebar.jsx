import { Calendar, ShoppingBag, ShieldCheck, Edit2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SIDE_TABS } from '@/features/profile/data/profileData';

function ProfileStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
        <Icon size={16} />
      </span>
      <div>
        <div className="text-[11px] text-gray-400">{label}</div>
        <div className="text-[13px] font-black text-[#0d1b2a]">{value}</div>
      </div>
    </div>
  );
}

export default function ProfileSidebar({ user, editing, onToggleEdit, onLogout, activeTab, onTabChange }) {
  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#0d1b2a] text-white">
          <span className="font-['Barlow_Condensed'] text-[32px] font-black">{initials}</span>
        </div>
        <h2 className="text-[18px] font-black text-[#0d1b2a]">{user?.first_name} {user?.last_name}</h2>
        <p className="text-[12px] text-gray-400">{user?.email || user?.phone_number}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button size="sm" variant={editing ? 'secondary' : 'primary'} onClick={onToggleEdit}>
            {editing ? <><X size={14} /> Annuler</> : <><Edit2 size={14} /> Modifier</>}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { onLogout(); }}>
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 space-y-2">
        <ProfileStat icon={Calendar} label="Membre depuis" value="Janvier 2025" />
        <ProfileStat icon={ShoppingBag} label="Commandes" value="12" />
        <ProfileStat icon={ShieldCheck} label="Statut" value={user?.type_user === 'vendeur' ? 'Vendeur' : 'Acheteur'} />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {SIDE_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-[13px] font-bold transition-all border-l-3 text-left ${
                activeTab === tab.key
                  ? 'border-l-orange-500 bg-orange-50 text-orange-500'
                  : 'border-l-transparent text-gray-500 hover:bg-gray-50 hover:text-[#0d1b2a]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
