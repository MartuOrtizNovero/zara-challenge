# MBST Smartphones — Zara Web Challenge

Single Page Application for browsing and purchasing smartphones, built as a technical challenge for Inditex/Zara.

## Tech stack

| Technology | Purpose |
|---|---|
| React 19 + Vite | Framework and bundler |
| React Router DOM | Client-side routing |
| CSS Modules | Scoped styles per component |
| Context API + useReducer | Global cart state management |
| Axios | HTTP client with API key authentication |
| localStorage | Cart persistence across sessions |
| Motion | Catalog grid animations |
| CSS Scroll Snap | Native similar products carousel |

## Architecture

```
src/
├── api/
│   ├── client/
│   │   └── apiClient.js          # Axios instance with x-api-key header
│   └── services/
│       └── productsService.js    # getProducts(), getProductById(), data mappers
├── app/
│   ├── layout/
│   │   └── MainLayout.jsx        # Root layout with LoadingBar orchestration
│   └── router/
│       └── AppRouter.jsx         # Route definitions
├── components/
│   ├── header/                   # Sticky header with cart icon
│   ├── loading-bar/              # Animated bar shown during page transitions
│   ├── product-card/             # Product card with hover animation
│   ├── search-bar/               # Controlled search input with clear button
│   └── similar-products-carousel/# Horizontal scroll carousel
├── context/
│   └── cart/
│       ├── CartProvider.jsx      # Provider with useReducer
│       ├── cartContext.js        # createContext
│       ├── cartReducer.js        # ADD_ITEM, REMOVE_ITEM, CLEAR_CART
│       ├── cartStorage.js        # localStorage read/write helpers
│       └── useCart.js            # Custom hook with error guard
├── pages/
│   ├── catalog/                  # Product grid with search and animation
│   ├── product-detail/           # Detail view with selectors and specs
│   └── cart/                     # Cart with item list and total
└── styles/
    ├── tokens.css                # CSS variables (colors, spacing, layout)
    └── globals.css               # Reset and base styles
```

The app follows a layered architecture: **API → Services → Context → Pages → Components**. Pages handle data fetching and state; components are presentational.

## Getting started

### Prerequisites

- Node 18+
- npm 9+

### Environment variables

Create a `.env` file at the project root based on `.env.example`:

```
VITE_API_BASE_URL=https://...
VITE_API_KEY=tu_api_key_aqui
```

### Commands

```bash
npm install          # Install dependencies

npm run dev          # Development mode — unminified assets, HMR enabled
npm run build        # Production mode — bundled and minified assets
npm run preview      # Serve the production build locally

npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Technical decisions

**CSS Modules**
Each component has its own `.module.css` file. This prevents style leakage between components and makes the relationship between JSX and CSS explicit.

**CSS Scroll Snap for the carousel**
Native browser implementation with no external dependencies. Smaller bundle size and consistent behavior across devices.

**API-based search, not local filtering**
Explicit requirement of the challenge. In a real production scenario, server-side search scales better and can leverage indexing and pagination.

**300ms debounce on search**
Prevents an API call on every keystroke. The `useEffect` cleanup cancels the pending timeout if the user keeps typing, ensuring only the last search is executed.

**Motion only on the catalog grid**
Animating the entire grid as a unit clearly communicates that the result set changed. Animating individual cards would add visual noise without semantic value.

**Context API + useReducer for the cart**
Predictable state with typed actions (`ADD_ITEM`, `REMOVE_ITEM`, `CLEAR_CART`). The reducer is a pure function that is easy to test in isolation. Redux was not needed given the app has a single global state domain.

**Lazy initializer in useReducer**
The third argument to `useReducer` ensures `getStoredCartItems()` runs only once on mount, not on every render.

**Result pattern in services**
Every service function returns `{ ok, data, errorMessage }` instead of throwing exceptions. The component decides how to handle errors without wrapping every call in a `try/catch`.

**`listKey` generated in the service layer**
The API may return products with duplicate IDs. Instead of using the array index as a React key (anti-pattern), a stable `listKey` (`${id}-${index}`) is generated in the service mapper. Components consume clean data without knowing about the server-side duplicates.

**`crypto.randomUUID()` for cart item IDs**
Generates guaranteed unique IDs for each item added to the cart. Includes a fallback to `crypto.getRandomValues()` for broader browser compatibility.

**`Intl.NumberFormat` for prices**
Consistent, localized EUR currency formatting with no external dependencies.

## Testing

Tests are written with **Vitest** and **React Testing Library**.

Coverage includes:

- **`cartReducer`** — ADD_ITEM, REMOVE_ITEM, and CLEAR_CART logic
- **`cartStorage`** — localStorage read, write, and clear operations
- **`useCart`** — error guard when used outside CartProvider
- **`ProductCard`** — rendering with and without image
- **`SearchBar`** — controlled input and clear button behavior
- **`CartPage`** — item list rendering, item removal, and total calculation

## Challenge requirements

- ✅ SPA with three views: catalog, product detail, and cart
- ✅ Product listing with real-time search (300ms debounce)
- ✅ Search results counter
- ✅ Product detail with name, image, price, and technical specifications
- ✅ Product image updates dynamically based on selected color
- ✅ Price updates in real time based on selected storage option
- ✅ Storage and color selectors with active visual state
- ✅ "Add to cart" button disabled until both color and storage are selected
- ✅ Similar products section with horizontal carousel
- ✅ Cart with item list, individual item removal, and total price
- ✅ Cart persisted in localStorage across sessions
- ✅ Header cart icon reflects current item count
- ✅ Animated loading bar on page transitions
- ✅ Responsive design: mobile, tablet, and desktop
- ✅ Accessibility: visible focus indicators, aria-labels, aria-pressed, semantic HTML
- ✅ Development and production modes via Vite
- ✅ ESLint configured with React Hooks rules
- ✅ Prettier configured for consistent formatting
- ✅ Unit and integration tests
