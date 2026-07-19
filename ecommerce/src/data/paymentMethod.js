export const paymentMethods = [
  {
    id: 'wave',
    apiId: 1, // MODIFICATION ICI — ID entier côté backend
    name: 'Wave',
    type: 'Mobile Money Afrique',
    logo: 'https://www.wave.com/img/nav-logo.svg',
    badge: 'Populaire au Sénégal',
    tone: 'border-sky-200 bg-sky-50',
    requiresPhone: true,
  },
  {
    id: 'orange-money',
    apiId: 2, // MODIFICATION ICI
    name: 'Orange Money',
    type: 'Mobile Money Afrique',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Logo_Orange_Money.svg',
    badge: 'SN, CI, ML, BF',
    tone: 'border-orange-200 bg-orange-50',
    requiresPhone: true,
  },
  {
    id: 'mtn-momo',
    apiId: 3, // MODIFICATION ICI
    name: 'MTN MoMo',
    type: 'Mobile Money Afrique',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_2022_logo.svg',
    badge: 'Afrique de l\'Ouest',
    tone: 'border-yellow-200 bg-yellow-50',
    requiresPhone: true,
  },
  {
    id: 'moov-money',
    apiId: 4, // MODIFICATION ICI
    name: 'Moov Money',
    type: 'Mobile Money Afrique',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Moov_Money_Flooz.png',
    badge: 'Moov / Flooz',
    tone: 'border-orange-200 bg-orange-50',
    requiresPhone: true,
  },
  {
    id: 'free-money',
    apiId: 5, // MODIFICATION ICI
    name: 'Free Money',
    type: 'Mobile Money Sénégal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
    badge: 'Sénégal',
    tone: 'border-red-200 bg-red-50',
    requiresPhone: true,
  },
  {
    id: 'paydunya',
    apiId: 6, // MODIFICATION ICI
    name: 'PayDunya',
    type: 'Agrégateur local',
    logo: 'https://logo.clearbit.com/paydunya.com',
    badge: 'Cartes + Mobile Money',
    tone: 'border-blue-200 bg-blue-50',
    requiresPhone: false,
  },
  {
    id: 'visa',
    apiId: 7, // MODIFICATION ICI
    name: 'Visa',
    type: 'Carte bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    badge: 'International',
    tone: 'border-blue-200 bg-blue-50',
    requiresPhone: false,
  },
  {
    id: 'mastercard',
    apiId: 8, // MODIFICATION ICI
    name: 'Mastercard',
    type: 'Carte bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    badge: 'International',
    tone: 'border-red-200 bg-red-50',
    requiresPhone: false,
  },
  {
    id: 'paypal',
    apiId: 9, // MODIFICATION ICI
    name: 'PayPal',
    type: 'Portefeuille digital',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    badge: 'Compte PayPal',
    tone: 'border-sky-200 bg-sky-50',
    requiresPhone: false,
  },
];