import { MapPin, Home, Building, Check, Edit2, Trash2 } from 'lucide-react';

const typeLabels = {
  shipping: 'Livraison',
  billing: 'Facturation',
  both: 'Les deux',
};

const typeIcons = {
  shipping: Home,
  billing: Building,
  both: MapPin,
};

export default function AddressCard({
  address,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  showRadio = false,
  showActions = false,
}) {
  const TypeIcon = typeIcons[address?.address_type] || MapPin;

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-lg border-2 p-4 transition-colors ${
        selected
          ? 'border-orange-400 bg-orange-50/30'
          : 'border-gray-100 hover:border-gray-200'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Badges + Radio */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {address?.is_default && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-600">
              <Check size={10} /> Par défaut
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-600">
            <TypeIcon size={10} /> {typeLabels[address?.address_type] || 'Livraison'}
          </span>
        </div>
        {showRadio && (
          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected ? 'border-orange-500' : 'border-gray-300'
          }`}>
            {selected && <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="space-y-1 text-[13px]">
        <div className="font-black text-[#0d1b2a]">
          {address?.first_name} {address?.last_name}
        </div>
        <div className="text-gray-600">{address?.street_address}</div>
        <div className="text-gray-600">
          {address?.city}{address?.postal_code ? ` ${address?.postal_code}` : ''}
        </div>
        {address?.state_region && (
          <div className="text-gray-600">{address?.state_region}</div>
        )}
        <div className="text-gray-500">{address?.country}</div>
        <div className="text-gray-500">{address?.phone_number}</div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(address); }}
              className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-orange-500 transition-colors"
            >
              <Edit2 size={13} /> Modifier
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(address); }}
              className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} /> Supprimer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
