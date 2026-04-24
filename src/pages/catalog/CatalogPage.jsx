import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ProductCard from "../../components/product-card/ProductCard.jsx";
import SearchBar from "../../components/search-bar/SearchBar.jsx";
import { getProducts } from "../../api/services/productsService.js";
import styles from "./CatalogPage.module.css";

const SEARCH_DEBOUNCE_DELAY = 300;
const PRODUCT_CARD_WIDTH_REM = 21.5;
const GRID_ANIMATION_OFFSET = 80;

const productsGridVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === "filter" ? GRID_ANIMATION_OFFSET : -GRID_ANIMATION_OFFSET,
  }),
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction === "filter" ? -GRID_ANIMATION_OFFSET : GRID_ANIMATION_OFFSET,
  }),
};

const MotionDiv = motion.div;

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
};
const getCatalogProductKey = (product, index) => {
  return `${product.id}-${product.name}-${product.brand}-${index}`;
};

const CatalogPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [animationDirection, setAnimationDirection] = useState("filter");
  const shouldReduceMotion = useReducedMotion();
  const { startPageLoading, finishPageLoading, canShowPageContent } =
    useOutletContext();
  const hasLoadedInitialProductsRef = useRef(false);
  const [hasLoadedInitialProducts, setHasLoadedInitialProducts] =
    useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  useEffect(() => {
    let isActive = true;
    const isInitialProductsLoad = !hasLoadedInitialProductsRef.current;

    const loadProducts = async () => {
      setErrorMessage("");

      if (isInitialProductsLoad) {
        startPageLoading();
      }

      const result = await getProducts({
        search: debouncedSearchValue,
      });

      if (!isActive) {
        return;
      }

      if (!result.ok) {
        setProducts([]);
        setErrorMessage(result.errorMessage);

        if (isInitialProductsLoad) {
          hasLoadedInitialProductsRef.current = true;
          setHasLoadedInitialProducts(true);
          finishPageLoading();
        }

        return;
      }

      setProducts(result.products);

      if (isInitialProductsLoad) {
        hasLoadedInitialProductsRef.current = true;
        setHasLoadedInitialProducts(true);
        finishPageLoading();
      }
    };

    loadProducts();

    return () => {
      isActive = false;

      if (isInitialProductsLoad) {
        finishPageLoading();
      }
    };
  }, [debouncedSearchValue, startPageLoading, finishPageLoading]);

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;

    setAnimationDirection(
      nextValue.trim().length >= searchValue.trim().length ? "filter" : "clear",
    );

    setSearchValue(nextValue);
  };

  const canRenderCatalogContent =
    hasLoadedInitialProducts && canShowPageContent;

  const showProducts =
    canRenderCatalogContent && !errorMessage && products.length > 0;

  const showEmptyState =
    canRenderCatalogContent && !errorMessage && products.length === 0;

  const showErrorMessage = canRenderCatalogContent && errorMessage;

  const handleClearSearch = () => {
    setAnimationDirection("clear");
    setSearchValue("");
  };

  const isCompactGrid = products.length < 5;

  const productsGridClassName = `${styles.productsGrid} ${
    isCompactGrid ? styles.productsGridCompact : ""
  }`;

  const productsGridStyle = isCompactGrid
    ? {
        "--products-count": products.length,
        "--compact-grid-width": `${products.length * PRODUCT_CARD_WIDTH_REM}rem`,
      }
    : undefined;

  const productsGridKey = products
    .map((product, index) => getCatalogProductKey(product, index))
    .join("|");

  return (
    <main className={styles.page}>
      {canRenderCatalogContent ? (
        <section className={styles.searchSection}>
          <div className={styles.searchSectionContent}>
            <SearchBar
              id="product-search"
              label="Search for a smartphone"
              name="search"
              value={searchValue}
              placeholder="Search for a smartphone..."
              onChange={handleSearchChange}
              onClear={handleClearSearch}
            />

            <p className={styles.resultsCount}>{products.length} results</p>
          </div>
        </section>
      ) : null}

      <section className={styles.productsSection} aria-label="Product list">
        {showErrorMessage ? (
          <p className={styles.errorMessage}>{errorMessage}</p>
        ) : null}

        {showEmptyState ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>No products found</p>
            <p className={styles.emptyStateDescription}>
              Try searching for another brand or model.
            </p>
          </div>
        ) : null}
        {showProducts ? (
          <div className={styles.productsGridViewport}>
            <AnimatePresence
              initial={false}
              mode="wait"
              custom={animationDirection}
            >
              <MotionDiv
                key={productsGridKey}
                className={productsGridClassName}
                style={productsGridStyle}
                custom={animationDirection}
                variants={productsGridVariants}
                initial={shouldReduceMotion ? false : "hidden"}
                animate="visible"
                exit="exit"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        x: {
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        opacity: {
                          duration: 0.35,
                          ease: "easeOut",
                        },
                      }
                }
              >
                {products.map((product, index) => (
                  <ProductCard
                    key={getCatalogProductKey(product, index)}
                    productId={product.id}
                    brand={product.brand}
                    name={product.name}
                    price={formatPrice(product.basePrice)}
                    imageUrl={product.imageUrl}
                    imageAlt={product.name}
                  />
                ))}
              </MotionDiv>
            </AnimatePresence>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default CatalogPage;
