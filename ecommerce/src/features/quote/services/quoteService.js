import api from '@/services/api';

// MODIFICATION ICI — Service devis (négociation de prix sur un produit)
const QUOTES_BASE = '/v1/orders/quotes';

// Crée une demande de devis (statut draft) : { shop, expires_at, lines: [{product|variant, quantity, negotiated_price, remarks?}] }
export async function createQuote(payload) {
  const { data } = await api.post(`${QUOTES_BASE}/client/`, payload);
  return data;
}

export async function getQuote(id) {
  const { data } = await api.get(`${QUOTES_BASE}/client/${id}/`);
  return data;
}

// Liste des devis du client connecté (paginated)
export async function getMyQuotes() {
  const { data } = await api.get(`${QUOTES_BASE}/client/my/`);
  return data;
}

export async function acceptQuote(id) {
  const { data } = await api.post(`${QUOTES_BASE}/client/${id}/accept/`);
  return data;
}

export async function counterQuote(id, payload) {
  // payload : { lines: [{product|variant, quantity, negotiated_price}], remarks? }
  const { data } = await api.post(`${QUOTES_BASE}/client/${id}/counter/`, payload);
  return data;
}

export async function rejectQuote(id) {
  const { data } = await api.post(`${QUOTES_BASE}/client/${id}/reject/`);
  return data;
}

// Convertit le devis accepté en commande en attente de paiement
export async function checkoutQuote(id, payload) {
  // payload : { origin_address, transport_mode, first_name?, last_name?, phone_number? }
  const { data } = await api.post(`${QUOTES_BASE}/client/${id}/checkout/`, payload);
  return data;
}

export async function payQuotePreview(token) {
  const { data } = await api.get(`${QUOTES_BASE}/client/pay/${token}/preview/`);
  return data;
}

// Marque la commande liée au devis comme payée
export async function payQuoteByToken(token, payload) {
  const { data } = await api.post(`${QUOTES_BASE}/client/pay/${token}/`, payload);
  return data;
}

// --- Seller endpoints ---

// Met à jour les lignes d'un devis via PATCH (client ou seller)
export async function updateQuote(id, payload) {
  const { data } = await api.patch(`${QUOTES_BASE}/client/${id}/`, payload);
  return data;
}

// Vendeur : envoyer le devis (draft/countered → sent), avec lignes optionnelles
export async function sendQuote(id, payload) {
  const { data } = await api.post(`${QUOTES_BASE}/seller/${id}/send/`, payload || {});
  return data;
}

// Vendeur : contre-proposition (draft/sent/countered → countered)
export async function sellerCounterQuote(id, payload) {
  const { data } = await api.post(`${QUOTES_BASE}/seller/${id}/counter/`, payload);
  return data;
}

// Vendeur : refuser
export async function sellerRejectQuote(id) {
  const { data } = await api.post(`${QUOTES_BASE}/seller/${id}/reject/`);
  return data;
}

// Vendeur : générer un lien de paiement (accepted → token)
export async function generatePaymentLink(id, payload) {
  const { data } = await api.post(`${QUOTES_BASE}/seller/${id}/payment-link/`, payload || {});
  return data;
}

// Vendeur : liste des devis de sa boutique
export async function getSellerQuotes(params) {
  const { data } = await api.get(`${QUOTES_BASE}/seller/list/`, { params });
  return data;
}
