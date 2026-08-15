// AJOUT — Helpers pur pour les moyens de paiement (feature payment)

const TONES = [
  'border-sky-200 bg-sky-50',
  'border-orange-200 bg-orange-50',
  'border-yellow-200 bg-yellow-50',
  'border-blue-200 bg-blue-50',
  'border-red-200 bg-red-50',
];

function getTone(index) {
  return TONES[index % TONES.length] || TONES[0];
}

function getBadge(type = '') {
  const t = type.toLowerCase();
  if (t.includes('mobile money')) return 'Mobile Money';
  if (t.includes('agregateur') || t.includes('agrégateur')) return 'Cartes + Mobile Money';
  if (t.includes('carte') || t.includes('portefeuille') || t.includes('digital')) return 'International';
  return 'Paiement en ligne';
}

// Normalise la réponse API vers le shape front (compat static + useOrderCheckout)
// id = slug stable (value ou id statique), apiId = ID numérique backend envoyé au pay
export function normalizePaymentMethods(methods = []) {
  return (Array.isArray(methods) ? methods : []).map((method, index) => ({
    id: method.value || method.id,
    apiId: method.apiId ?? method.id,
    value: method.value || method.id,
    name: method.name,
    type: method.type || 'Paiement',
    logo: method.logo ?? method.image ?? null,
    requiresPhone: !!(method.requiresPhone ?? method.requires_phone),
    tone: method.tone || getTone(index),
    badge: method.badge || getBadge(method.type),
  }));
}

// Résout le pays à utiliser pour le filtrage
export function resolveCountry(userCountry, addressCountry) {
  return (addressCountry || userCountry || 'SN').toUpperCase();
}
