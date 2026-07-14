import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import AddressCard from '@/components/shared/AddressCard';
import ModalDeleteConfirm from '@/features/profile/components/ModalDeleteConfirm';
import ModalAddressForm from '@/features/profile/components/ModalAddressForm';

export default function ProfileAddresses({ addresses, isLoading, addMutation, updateMutation, deleteMutation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
            <MapPin size={18} />
          </span>
          <div>
            <h2 className="text-[16px] font-black text-[#0d1b2a]">Adresses de livraison</h2>
            <p className="text-[12px] text-gray-400">Gérez vos adresses pour la livraison</p>
          </div>
        </div>
        <Button size="sm" onClick={handleOpenAdd}>
          <Plus size={14} /> Ajouter
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8 text-[13px] text-gray-400">Chargement...</div>
      )}

      {/* Liste vide */}
      {!isLoading && addresses?.length === 0 && (
        <div className="text-center py-8">
          <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-[13px] text-gray-400">Aucune adresse enregistrée</p>
          <Button size="sm" className="mt-3" onClick={handleOpenAdd}>
            <Plus size={14} /> Ajouter une adresse
          </Button>
        </div>
      )}

      {/* Liste des adresses */}
      {!isLoading && addresses?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              showActions
              onEdit={() => handleOpenEdit(addr)}
              onDelete={() => setDeleteTarget(addr)}
            />
          ))}
        </div>
      )}

      {/* MODIFICATION ICI — Modale ajout/édition adresse */}
      {modalOpen && (
        <ModalAddressForm
          address={editingAddress}
          onClose={handleCloseModal}
          addMutation={addMutation}
          updateMutation={updateMutation}
        />
      )}

      {/* MODIFICATION ICI — Modale confirmation suppression */}
      {deleteTarget && (
        <ModalDeleteConfirm
          address={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
