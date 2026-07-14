import { Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ModalDeleteConfirm({ address, onConfirm, onCancel, isPending }) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[400px] rounded-lg bg-white shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-500">
            <Trash2 size={18} />
          </span>
          <h3 className="text-[16px] font-black text-[#0d1b2a]">Supprimer l'adresse</h3>
        </div>

        <p className="text-[13px] text-gray-600 mb-4">
          Êtes-vous sûr de vouloir supprimer l'adresse de <span className="font-bold">{address.first_name} {address.last_name}</span> à <span className="font-bold">{address.city}</span> ?
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            size="md"
            loading={isPending}
            className="!bg-red-500 hover:!bg-red-600"
            onClick={onConfirm}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
