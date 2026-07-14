# Instructions pour le développement (TradeHub)

Tu es un développeur Full-Stack Senior expert en Django (Backend) et React + Vite + Tailwind CSS (Frontend). Tu m'aides à coder sur le projet TradeHub.

---

## Stack Technique

| Couche           | Technologie                         | Version  |
|------------------|-------------------------------------|----------|
| **Frontend**     | React + JSX (pas de TypeScript)     | 19       |
| **Bundler**      | Vite                                | 8        |
| **Routing**      | React Router DOM (Data Router)      | 7        |
| **Styling**      | Tailwind CSS + DaisyUI              | v4 + v5  |
| **State local**  | Zustand                             | 5        |
| **State server** | TanStack React Query                | 5        |
| **Formulaires**  | React Hook Form                     | 7        |
| **HTTP client**  | Axios                               | 1        |
| **Icônes**       | Lucide React                        | 1        |
| **Animations**   | Framer Motion                       | 12       |
| **Backend**      | Django + DRF + PostgreSQL           | -        |

---

## Règles Strictes de Modification

1. **Commentaires ciblés :** Utilise des commentaires `// MODIFICATION ICI` ou `# AJOUT` pour signaler exactement où tu as modifié le code.
2. **Sécurisation des types :** Utilise TOUJOURS l'optional chaining (`?.`) et prévois des fallbacks (`|| {}`, `|| []`, `?? null`) pour les réponses d'API afin d'éviter les erreurs `Cannot read properties of undefined`.
3. **Respecte l'architecture :** Ne casse jamais la séparation des couches. Lis le fichier jusqu'au bout avant de modifier quoi que ce soit.
4. **Un fichier = un rôle clair :** Ne mélange jamais la logique métier dans un composant, ni les appels API dans un hook business.

---

## Architecture Feature-Sliced

Le projet suit une architecture par fonctionnalités (`features/`). Chaque feature est autonome avec ses propres composants, hooks, services, helpers et données.

### Structure du projet

```
src/
├── main.jsx                          # Point d'entrée React
├── App.jsx                           # Root : QueryClientProvider + UIProvider + RouterProvider
├── index.css                         # Global CSS (Tailwind v4 + DaisyUI v5)
│
├── components/
│   ├── ui/                           # Composants réutilisables génériques
│   │   ├── Button.jsx                # Bouton (variants: primary/secondary/ghost)
│   │   ├── Input.jsx                 # Input (forwardRef, label, error, suffix)
│   │   ├── InputCountry.jsx          # Sélecteur de pays (react-flags-select)
│   │   └── InputImage.jsx            # Upload d'image
│   ├── shared/
│   │   ├── TopBar.jsx                # Barre du haut alternative
│   │   └── DarkPageShell.jsx         # Wrapper page thème sombre
│   └── VariantModal.jsx              # Modal globale de sélection de variante
│
├── context/
│   └── UIContext.jsx                  # React Context (modal catégorie)
│
├── data/
│   ├── data.js                       # Données statiques/mockées (produits, slides, catégories)
│   └── paymentMethod.js              # Méthodes de paiement (Wave, Orange Money, MTN MoMo)
│
├── features/                         # === FEATURE SLICED ===
│   ├── auth/                         # Authentification
│   │   ├── components/LoginModal.jsx
│   │   ├── hooks/useAuth.js          # useAuth, useLogin, useCheckAuth, useLogout, useSignup
│   │   └── services/authService.js
│   ├── cart/                         # Panier + checkout
│   │   ├── components/               # CartSidebar, CartSummary, CheckoutForm, PaymentSelector...
│   │   ├── hooks/                    # useCart (facade), useCartData, useCartUI, useCheckout
│   │   ├── services/cartService.js
│   │   └── utils/helpers.js          # normalizeCartItems
│   ├── product/                      # Produits + variantes
│   │   ├── components/               # ProductCard, ProductSkeleton, CategoryProductCard...
│   │   ├── hooks/                    # useProduct, useVariant
│   │   ├── services/productService.js
│   │   └── utils/helpers.js          # 15+ fonctions d'arbre de variantes
│   ├── profile/                      # Profil utilisateur
│   │   ├── components/               # ProfileInfoForm, ProfilePasswordForm...
│   │   ├── hooks/useProfile.js       # useProfileForm, useAddressForm, usePasswordForm
│   │   ├── services/profileService.js
│   │   └── data/profileData.js       # Données mockées profil
│   ├── order/                        # Commandes
│   │   ├── components/               # OrderCard, OrderTrackingModal, OrdersFilterTabs
│   │   ├── hooks/useOrders.js
│   │   ├── services/orderService.js
│   │   └── data/orderData.js         # Données mockées commandes
│   ├── vendor/                       # Vendeur
│   │   ├── hooks/useVendor.js
│   │   └── services/vendorService.js
│   ├── catalog/                      # Catégories + recherche
│   │   └── components/               # CategorySidebar, CategoryStrip
│   └── home/                         # Page d'accueil
│       └── components/               # HeroSlider, FlashDeals, B2BSection, TrustStrip...
│
├── layouts/
│   ├── index.jsx                     # BasicLayout + SimpleLayout (deux layouts)
│   ├── AnnouncementBar.jsx
│   ├── CategorySelectorModal.jsx
│   ├── Footer.jsx
│   ├── SubNav.jsx
│   └── TopNav.jsx
│
├── pages/
│   ├── auth/                         # LoginPage, SignupPage
│   ├── b2b/                          # B2BPage, ImportPage, ProPage
│   ├── cart/                         # CartPage, CheckoutPage, SuccessPage
│   ├── catalog/                      # AllCategoriesPage, CategoryProductsPage, SearchResultsPage
│   ├── deals/                        # DealsPage, FlashDealsPage, NewProductsPage, TopSellersPage
│   ├── help/                         # HelpPage
│   ├── home/                         # HomePage
│   ├── order/                        # OrdersPage, OrderDetailPage
│   ├── product/                      # AllProductsPage, ProductDetailPage
│   ├── profile/                      # ProfilePage
│   └── shop/                         # ShopPage
│
├── routes/router.jsx                 # Configuration des routes + guards
├── services/api.js                   # Instance Axios + interceptors
├── stores/                           # Stores Zustand
│   ├── authStore.js
│   ├── cartStore.js
│   ├── checkoutStore.js
│   ├── uiStore.js
│   └── variantStore.js
├── types/index.js                    # JSDoc typedefs + constantes (PRODUCT_STATUS, USER_ROLES)
└── utils/
    ├── constants.js                  # APP_NAME, API_BASE_URL, ROUTES, BREAKPOINTS, CART_LIMITS
    └── helpers.js                    # formatPrice, formatDate, pricing, search/sort helpers
```

### Règle d'or — Séparation des couches

| Couche       | Responsabilité                                   | Exemple                                  |
|--------------|--------------------------------------------------|------------------------------------------|
| **Components** | Affichage uniquement (pas de logique métier)    | `ProductCard.jsx`                        |
| **Hooks**      | Logique métier, coordination entre services    | `useCart.js`, `useAuth.js`               |
| **Services**   | Appels API (Axios)                             | `cartService.getCartItems()`             |
| **Stores**     | État global (Zustand)                          | `authStore.js`, `variantStore.js`        |
| **Helpers**    | Calculs, transformations, fonctions pures      | `normalizeCartItems()`, `formatPrice()`  |

---

## Stores Zustand

Le projet utilise **5 stores Zustand**, chacun avec un rôle précis. Tous sont dans `src/stores/`.

### authStore.js — Mémoire uniquement (PAS de persist)

```js
{ user, access, isAuthenticated, setUser(), loginSuccess(user, access), logout() }
```

- `access` = JWT access token en mémoire (disparaît au refresh de page)
- Le refresh token est un HttpOnly cookie (géré par le navigateur)
- `logout()` nettoie tout le store

### cartStore.js — UI state only

```js
{ cartOpen, setCartOpen(open) }
```

- Contrôle l'ouverture/fermeture de la sidebar panier
- Données panier = React Query (PAS dans le store)

### variantStore.js — État modal variante (mémoire)

```js
{ open, loading, product, raw, variantsMap, selection, setLoading(), setOpen(), setProduct(),
  setRaw(), setVariantsMap(), setSelection(name, value), close() }
```

- `raw` = arbre de variantes brut depuis l'API
- `variantsMap` = arbre parsé (collectVariantMap)
- `selection` = attributs sélectionnés (cascade avec validation via `getValidSelection`)
- `close()` réinitialise tout


### uiStore.js — Toggles UI

```js
{ loginModalOpen, openLoginModal(), closeLoginModal() }
```

### Conventions Zustand

- **Lire le store dans un composant :** `useStore(state => state.champ)` ou `useShallow()` pour plusieurs champs
- **Lire hors composant (dans un hook/service) :** `useStore.getState().action()`
- **Modifier hors composant :** `useStore.setState({ champ: valeur })`

---

## Services API (Axios)

### Instance centralisée — `src/services/api.js`

- **Base URL :** `import.meta.env.VITE_API_URL || 'http://localhost:3000/api'`
- **Dev proxy :** Vite proxyfie `/api` → `http://localhost:8000` (Django backend)
- Toutes les APIs sont sous `/v1/`

### Interceptors

**Request interceptor :**
- Injecte automatiquement le header `Authorization: Bearer {access_token}` depuis `authStore`

**Response interceptor :**
- Sur **401** (sauf endpoints `/token/`) :
  1. Appelle `POST /v1/auth/token/refresh/` (cookie HttpOnly envoyé automatiquement)
  2. Stocke le nouvel access token dans `authStore`
  3. Retry la requête originale
  4. Si échec du refresh → `logout()` + redirection `/login`

### Pattern de chaque service

Chaque feature a un fichier `services/{feature}Service.js` qui exporte un **objet plat** de méthodes :

```js
// features/cart/services/cartService.js
import api from '@/services/api.js'

export const cartService = {
    getCartItems: () => api.get('/v1/cart/'),
    addCartItems: (data) => api.post('/v1/cart/add/', data),
    changeQuantityItem: (id, data) => api.patch(`/v1/cart/${id}/change-quantity/`, data),
    removeCartItem: (data) => api.delete('/v1/cart/remove-product/', { data }),
    clearCart: () => api.delete('/v1/cart/clear/'),
    previewCouponCart: (data) => api.post('/v1/cart/preview-coupon/', data),
}
```

- Jamais de `try/catch` dans les services → la gestion d'erreur est dans les hooks
- Les services retournent des réponses Axios brutes

## Server State — TanStack React Query

### Configuration (dans `App.jsx`)

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});
```

### Patterns utilisés

**Lecture (useQuery) :**
```js
const { data, isLoading, error } = useQuery({
  queryKey: ["products", params],
  queryFn: () => productService.getProducts(params),
  enabled: !!id,          // conditionnel si besoin
  staleTime: 30_000,      // cache 30s pour le cart
  placeholderData: keepPreviousData,  // garde l'ancien data pendant le re-fetch
});
```

**Écriture (useMutation) :**
```js
const mutation = useMutation({
  mutationFn: (payload) => cartService.addCartItems(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: CART_ITEMS_QUERY_KEY });
  },
});
```

### Conventions Query Keys

- Namespacés par feature : `["products"]`, `["product", id]`, `["cart-items"]`, `["auth-check"]`
- Centralisés si réutilisés : `cartQueryKeys.js` exporte `CART_ITEMS_QUERY_KEY`
- Toujours passer les paramètres dans la clé : `["products", params]`

---

## Hooks Personnalisés

### Auth — `features/auth/hooks/useAuth.js`

| Hook           | Rôle                                                           |
|----------------|----------------------------------------------------------------|
| `useAuth()`    | Lit le store auth (user, access, isAuthenticated) via `useShallow` |
| `useLogin()`   | Mutation login. Accepte `{ onSuccess }` optionnel (pour la modal). Retourne `{ login, isPending, error, resetError }` |
| `useCheckAuth()` | Vérifie la session au chargement via cookie HttpOnly (`GET /v1/auth/check/`). Met à jour le store si authentifié |
| `useLogout()`  | Mutation logout (API + nettoyage store + redirection). Même si l'API échoue, déconnecte côté frontend |
| `useSignup()`  | Mutation inscription. Redirige vers `/login` au succès |

### Cart — `features/cart/hooks/`

| Hook           | Rôle                                                           |
|----------------|----------------------------------------------------------------|
| `useCart()`    | **Hook facade** qui compose `useCartData` + `useCartUI` + `useCheckout`. Point d'entrée unique pour tout ce qui est panier |
| `useCartData()`| CRUD panier via React Query : `addToCart`, `changeQty`, `removeItem`, `clearCart`. Gère aussi l'ouverture de la modal variante si produit a des variantes |
| `useCartUI()`  | État UI : `cartOpen`, `setCartOpen`, `pendingKey` (item en cours de chargement) |
| `useCheckout()`| Totaux (subtotal, shipping, serviceFee, total), validation coupon, méthode de paiement, **synchronisation bidirectionnelle form ↔ checkoutStore** |

**Pattern facade :**
```js
// useCart.js compose les sous-hooks
export function useCart({ form } = {}) {
  const cartUI = useCartUI();
  const cartData = useCartData({ setCartOpen: cartUI.setCartOpen, setPendingKey: cartUI.setPendingKey });
  const checkout = useCheckout({ cartItems: cartData.cartItems, form });
  return { ...cartData, cartOpen: cartUI.cartOpen, setCartOpen: cartUI.setCartOpen, checkout };
}
```

### Product — `features/product/hooks/`

| Hook                    | Rôle                                                        |
|-------------------------|-------------------------------------------------------------|
| `useProducts(params)`   | Query liste produits avec paramètres, `keepPreviousData`     |
| `useProduct(id)`        | Query produit unique par ID, `enabled: !!id`                |
| `useRecommendations()`  | Query recommandations                                       |
| `useProductPromotions()`| Query promotions                                            |
| `useSearchProduct()`    | Mutation recherche                                          |
| `useSearchAutocomplete()`| Mutation autocomplete                                     |
| `useProductVariant(id)` | Query arbre de variantes par produit ID                     |
| `useProductDetailShop(id)`| Query détails boutique                                    |
| `useProductGallery(id)` | Query galerie images                                        |
| `useVariantActions()`   | Logique métier modale variante : `openVariant(product)` fetch + parse, `confirmVariant()` ajoute au panier |

### Profile — `features/profile/hooks/useProfile.js`

| Hook              | Rôle                                                        |
|-------------------|-------------------------------------------------------------|
| `useProfileForm(user)` | Formulaire profil (edit mode toggle + mutation update)  |
| `useAddressForm()`    | Formulaire adresse (mutation add)                      |
| `usePasswordForm()`   | Formulaire mot de passe (toggle visibility + mutation change) |

### Order — `features/order/hooks/useOrders.js`

| Hook        | Rôle                                                        |
|-------------|-------------------------------------------------------------|
| `useOrders()` | Liste commandes filtrées + mutation place order           |

### Vendor — `features/vendor/hooks/useVendor.js`

| Hook          | Rôle                                                        |
|---------------|-------------------------------------------------------------|
| `useVendor()` | Mutation inscription vendeur (formData multipart)        |

---

## Formulaires — React Hook Form

### Pattern standard

```js
// Dans un hook ou une page
import { useForm } from 'react-hook-form';

const form = useForm({
  mode: 'onBlur',  // Toujours mode onBlur
});
```

### Validation inline

```jsx
<Input
  {...register('email', {
    required: "L'email est requis",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' }
  })}
  error={errors.email?.message}
/>
```

### Composant Input — `components/ui/Input.jsx`

- Utilise `React.forwardRef` pour être compatible avec `register()` de RHF
- Props : `label`, `error`, `suffix`, `required`, `className`, + toutes les props input natif
- Pattern : `<Input {...register('field', rules)} error={errors.field?.message} />`

### Synchronisation bidirectionnelle form ↔ store

Le hook `useCheckout` implémente la synchro entre RHF et `checkoutStore` :
- **Store → Form :** `useEffect(() => form.reset(checkoutData), [checkoutData])`
- **Form → Store :** `useEffect` qui watch les valeurs du formulaire et appelle `setCheckoutData()`

### Formulaires existants

1. **LoginPage / LoginModal** — Email + mot de passe
2. **SignupPage** — Inscription complète
3. **CheckoutForm** — Adresse, ville, code postal, pays, téléphone
4. **ProfileInfoForm** — Prénom, nom, email, téléphone, adresse
5. **ProfilePasswordForm** — Mot de passe actuel, nouveau, confirmation
6. **Vendor Registration** — multipart/form-data avec `InputImage`

---

## Routing — React Router DOM v7

### Configuration — `src/routes/router.jsx`

Utilise `createBrowserRouter` (Data Router) avec deux groupes de routes :

### Deux layouts

**`BasicLayout`** — Navigation complète :
- `AnnouncementBar` → `TopNav` → `SubNav` → `<Outlet/>` → `Footer` + `CartSidebar` + `VariantModal` + `LoginModal`
- Utilisé pour : home, search, deals, B2B, auth pages

**`SimpleLayout`** — Minimal :
- `AnnouncementBar` → `<Outlet/>` + `VariantModal` + `LoginModal`
- Utilisé pour : profile, cart, checkout, product detail, categories, shop

### Guards — `PrivateRoute`

```jsx
function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) {
    useUIStore.getState().openLoginModal();  // Ouvre la MODAL au lieu de rediriger
    return null;
  }
  if (role && user.type_user !== role) return <Navigate to="/" replace />;
  return children;
}
```

### Route Wrappers

- **`ProductDetailRoute`** — Récupère l'ID via `useParams()`, fetch le produit avec `useProduct(id)`, injecte les callbacks (`onAddToCart`, `onOpenShop`, etc.) en props
- **`OrderDetailRoute`** — Récupère la commande depuis les données mockées, redirige si introuvable

### Catch-all

```js
{ path: "*", element: <Navigate to="/" replace /> }
```

---

## Auth Flow — Séquence Complète

```
1. App Load → useCheckAuth() appelle GET /v1/auth/check/
   └── Le navigateur envoie le cookie HttpOnly automatiquement
   └── Si authentifié → setUser(user) dans authStore

2. Login → useLogin() appelle POST /v1/auth/token/ {email, password}
   └── Réponse: { user, access }
   └── loginSuccess(user, access) → stocke en mémoire (authStore)

3. Requête API → Interceptor request injecte Authorization: Bearer {access}

4. 401 reçu → Interceptor response:
   └── POST /v1/auth/token/refresh/ (cookie HttpOnly envoyé auto)
   └── Succès → nouveau access token stocké → retry requête
   └── Échec → logout() + redirection /login

5. Logout → useLogout() appelle POST /v1/auth/logout/
   └── Serveur supprime le cookie HttpOnly
   └── Frontend: logout() nettoie authStore
```

**Points clés :**
- Access token = **Zustand in-memory** (pas de persist, disparaît au refresh)
- Refresh token = **HttpOnly cookie** (jamais accessible en JS, sécurisé)
- **Aucun token dans localStorage/sessionStorage**

---

## Styling & UI

### Tailwind CSS v4 + DaisyUI v5

- **Utility-first** : tout le style est en classes Tailwind inline
- **Pas de CSS modules, pas de styled-components, pas de CSS-in-JS**
- Seul le CSS global dans `index.css` : `@import "tailwindcss"` + `@plugin "daisyui"`
- Animation marquee custom dans `index.css` uniquement

### Icônes

- **Lucide React** exclusivement : `<Icon size={20} />`
- Font Awesome chargé dans `index.html` mais pas utilisé dans le code

### Fonts

- **Nunito Sans** — corps de texte (via Google Fonts)
- **Barlow Condensed** — titres et logo

### Palette

- Dark navy : `#0d1b2a`
- Orange : `orange-500` (accent principal)
- Fond : `gray-100` / `white`
- Texte : `gray-700`, `gray-900`

### Animations

- Framer Motion disponible, utilisé pour les transitions de page
- `framer-motion` importé dans le package.json

### Responsive

- Prefixes Tailwind : `sm:`, `md:`, `lg:`, `xl:`
- Breakpoints dans `constants.js` : SM=640, MD=768, LG=1024, XL=1280

---

## Conventions de Nommage

| Élément         | Convention              | Exemple                         |
|-----------------|-------------------------|----------------------------------|
| **Page**        | `PascalCase` + `Page`   | `HomePage.jsx`, `CheckoutPage.jsx` |
| **Composant**   | `PascalCase`            | `ProductCard.jsx`, `CartSidebar.jsx` |
| **Hook**        | `camelCase` + `use`     | `useCart.js`, `useAuth.js`       |
| **Service**     | `camelCase` + `Service` | `cartService.js`, `authService.js` |
| **Store**       | `camelCase` + `Store`   | `authStore.js`, `variantStore.js` |
| **Helper**      | `camelCase`             | `helpers.js`, `helpers.js`       |
| **Constante**   | `UPPER_SNAKE_CASE`      | `API_BASE_URL`, `CART_LIMITS`    |

### Extensions de fichiers

- **Composants React** → `.jsx`
- **Tout le reste** (hooks, services, stores, utils, data) → `.js`

### Imports

- Alias `@/` = `src/` (configuré dans Vite) : `import { useAuthStore } from '@/stores/authStore'`
- Toujours regrouper : libraries → alias → chemins relatifs

---

## Données

### Données mixtes (API réelle + mockées)

| Source   | Données                                                |
|----------|--------------------------------------------------------|
| **API réelle** | Produits, panier, auth, commandes (liste), profil, vendeur |
| **Mockées**    | Détail commande (`orderData.js`), profil (`profileData.js`), produits statiques (`data.js`) |

### Constantes — `src/utils/constants.js`

```js
APP_NAME = 'eCommerce'
API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
ROUTES = { HOME: '/', SEARCH: '/search', ... }
BREAKPOINTS = { SM: 640, MD: 768, LG: 1024, XL: 1280 }
CART_LIMITS = { MAX_QTY: 999, MIN_QTY: 1 }
```

### Types JSDoc — `src/types/index.js`

Des typedefs JSDoc existent pour `Product`, `User`, `CartItem`, `Route` + constantes `PRODUCT_STATUS` et `USER_ROLES`.

---

## Notes Importantes

- **Pas de TypeScript** — Le projet est en JavaScript + JSX. Les `@types/react` sont là uniquement pour l'IntelliSense de l'IDE.
- **Pas de tests** — Aucun framework de test installé, aucun fichier test.
- **Cible géographique** — Afrique de l'Ouest francophone (Sénégal principalement), prix en FCFA, paiements mobile (Wave, Orange Money, MTN MoMo).
- **React Context** — Un seul `UIContext` pour la modal catégorie (lourdement utilisé). Tout le reste passe par Zustand.
- **Modal globales** — `VariantModal` et `LoginModal` sont rendues dans les deux layouts, lisent directement les stores Zustand.
