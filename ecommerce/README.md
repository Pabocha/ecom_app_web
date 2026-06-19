# TradeHub — Global Marketplace B2B & B2C

Marketplace e-commerce B2B & B2C construite avec React 19 + Vite 8.

## Stack technique

| Technologie      | Version |
|------------------|---------|
| React            | 19      |
| Vite             | 8       |
| Tailwind CSS     | 4       |
| DaisyUI          | 5       |
| Zustand          | 5       |
| TanStack Query   | 5       |
| React Router     | 7       |
| Axios            | 1       |
| Framer Motion    | 12      |
| React Hook Form  | 7       |

## Architecture

```
src/
├── components/       # Composants réutilisables (layout, home, product, shared, ui)
├── context/          # Contexte React (UI)
├── data/             # Données mockées et statiques
├── features/         # Fonctionnalités métier (cart)
│   └── cart/
│       ├── components/   # Composants spécifiques au panier
│       └── data/         # Données liées au panier
├── hooks/            # Hooks personnalisés (auth, cart, vendor)
├── layouts/          # Layouts de l'application (HomeLayout, BasicLayout)
├── pages/            # Pages / Vues
├── routes/           # Configuration des routes
├── services/         # Client API (Axios + intercepteurs)
├── stores/           # Stores Zustand (auth, cart)
├── types/            # Constantes et typedefs JSDoc
└── utils/            # Utilitaires (constants, helpers)
```

## Démarrer

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

Le serveur tourne sur `http://localhost:3000`. Les appels `/api/*` sont proxyfiés vers `http://localhost:8000` (backend Django).

## Scripts

| Commande           | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Lance le serveur de développement |
| `npm run build`    | Build de production            |
| `npm run preview`  | Prévisualisation du build      |
| `npm run lint`     | Vérification ESLint            |
