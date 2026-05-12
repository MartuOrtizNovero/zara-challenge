import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ProductCard from "../../components/product-card/ProductCard.jsx";
import SearchBar from "../../components/search-bar/SearchBar.jsx";
import useProducts from "../../hooks/useProducts.js";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./CatalogPage.module.css";

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


const CatalogPage = () => {
  const {
    products,
    errorMessage,
    searchValue,
    animationDirection,
    handleSearchChange,
    handleClearSearch,
  } = useProducts();
  const shouldReduceMotion = useReducedMotion();
  const { startPageLoading, finishPageLoading, canShowPageContent } =
    useOutletContext();

  useEffect(() => {
    if (products !== null) return;
    startPageLoading();
    return () => finishPageLoading();
  }, [products, startPageLoading, finishPageLoading]);

  const hasLoadedInitialProducts = products !== null;

  const canRenderCatalogContent =
    hasLoadedInitialProducts && canShowPageContent;

  const showProducts =
    canRenderCatalogContent && !errorMessage && products.length > 0;

  const showEmptyState =
    canRenderCatalogContent && !errorMessage && products.length === 0;

  const showErrorMessage = canRenderCatalogContent && errorMessage;

  const isCompactGrid = !!products && products.length < 5;

  const productsGridClassName = `${styles.productsGrid} ${
    isCompactGrid ? styles.productsGridCompact : ""
  }`;

  const productsGridStyle = isCompactGrid
    ? {
        "--compact-grid-width": `${products.length * PRODUCT_CARD_WIDTH_REM}rem`,
        "--compact-grid-cols": products.length,
        "--compact-grid-cols-tablet": Math.min(products.length, 2),
      }
    : undefined;

  const productsGridKey = products?.map((p) => p.listKey).join("|") ?? "";

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
                {products.map((product) => (
                  <ProductCard
                    key={product.listKey}
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
