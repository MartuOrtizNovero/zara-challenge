# MBST Smartphones — Zara Web Challenge

Single Page Application for browsing and purchasing smartphones, built as a technical challenge for Inditex/Zara.

**Live demo:** https://zara-challenge-seven.vercel.app/

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

## Getting started

### Environment variables

Create a `.env` file at the project root based on `.env.example`:

```
VITE_API_BASE_URL=your_api_base_url
VITE_API_KEY=your_api_key
```

### Commands

```bash
npm install       # Install dependencies
npm run dev       # Development mode — unminified assets, HMR enabled
npm run build     # Production mode — bundled and minified assets
npm run preview   # Serve the production build locally
npm run test      # Run tests
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## Technical decisions

**CSS Modules** — Each component has its own `.module.css` file. Prevents style leakage between components and makes the JSX/CSS relationship explicit.

**API-based search, not local filtering** — Explicit requirement of the challenge. Server-side search scales better and can leverage indexing and pagination.

**300ms debounce on search** — Prevents an API call on every keystroke. The `useEffect` cleanup cancels the pending timeout if the user keeps typing, ensuring only the last search is executed.

**Context API + useReducer for the cart** — Predictable state with typed actions (`ADD_ITEM`, `REMOVE_ITEM`). The reducer is a pure function, easy to test in isolation. Redux was not needed given the app has a single global state domain.

**CSS Scroll Snap for the carousel** — Native browser implementation with no external dependencies. Smaller bundle and consistent behavior across devices.

**Motion only on the catalog grid** — Animating the entire grid as a unit communicates that the result set changed. Animating individual cards would add visual noise without semantic value.

## Testing

Tests are written with **Vitest** and **React Testing Library**.

| Suite | What it covers |
|---|---|
| `cartReducer` | ADD_ITEM and REMOVE_ITEM logic |
| `cartStorage` | localStorage read, write, and clear |
| `CartProvider` | State initialization and dispatch integration |
| `useCart` | Error guard when used outside CartProvider |
| `ProductCard` | Rendering with and without image |
| `SearchBar` | Controlled input and clear button behavior |
| `CartPage` | Item list, item removal, and total calculation |
| `Header` | Cart icon and item count rendering |
| `productsService` | Data mapping and API error handling |
| `formatPrice` | EUR currency formatting |

## Challenge requirements

- ✅ **Testing** — Vitest + React Testing Library, covering reducers, services, hooks, and components
- ✅ **Responsive** — Mobile (390px), tablet (768px), and desktop layouts
- ✅ **Accessibility** — Semantic HTML, `aria-label`, `aria-pressed`, visible focus indicators on all interactive elements
- ✅ **Linters and formatters** — ESLint with React Hooks rules, Prettier configured
- ✅ **Clean console** — No errors or warnings in the browser console
