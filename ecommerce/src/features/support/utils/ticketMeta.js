export const TICKET_CATEGORIES = [
  { value: 'commande', label: 'Commande' },
  { value: 'paiement', label: 'Paiement' },
  { value: 'livraison', label: 'Livraison' },
  { value: 'retour', label: 'Retour / Remboursement' },
  { value: 'compte', label: 'Compte' },
  { value: 'autre', label: 'Autre' },
];

export const TICKET_PRIORITIES = [
  { value: 'basse', label: 'Basse' },
  { value: 'moyenne', label: 'Moyenne' },
  { value: 'haute', label: 'Haute' },
];

export const TICKET_STATUS = {
  ouvert: { label: 'Ouvert', className: 'bg-cyan-100 text-cyan-700' },
  en_cours: { label: 'En cours', className: 'bg-amber-100 text-amber-700' },
  resolu: { label: 'Résolu', className: 'bg-green-100 text-green-700' },
  ferme: { label: 'Fermé', className: 'bg-gray-200 text-gray-600' },
};

export function ticketStatusMeta(status) {
  return TICKET_STATUS[status] || { label: status || '—', className: 'bg-gray-100 text-gray-600' };
}
