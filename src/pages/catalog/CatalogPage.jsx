import { useEffect, useState } from "react";
import ProductCard from "../../components/product-card/ProductCard.jsx";
import SearchBar from "../../components/search-bar/SearchBar.jsx";
import { getProducts } from "../../api/services/productsService.js";
import styles from "./CatalogPage.module.css";

const SEARCH_DEBOUNCE_DELAY = 300;

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
};

const CatalogPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const result = await getProducts({
        search: debouncedSearchValue,
      });

      if (!result.ok) {
        setProducts([]);
        setErrorMessage(result.errorMessage);
        setIsLoading(false);
        return;
      }

      setProducts(result.products);
      setIsLoading(false);
    };

    loadProducts();
  }, [debouncedSearchValue]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const showProducts = !isLoading && !errorMessage && products.length > 0;
  const showEmptyState = !isLoading && !errorMessage && products.length === 0;

  return (
    <main className={styles.page}>
      <section className={styles.searchSection}>
        <div className={styles.searchSectionContent}>
          <SearchBar
            id="product-search"
            label="Search for a smartphone"
            name="search"
            value={searchValue}
            placeholder="Search for a smartphone..."
            onChange={handleSearchChange}
          />

          <p className={styles.resultsCount}>{products.length} results</p>
        </div>
      </section>

      <section className={styles.productsSection} aria-label="Product list">
        {isLoading ? (
          <p className={styles.feedbackMessage}>Loading products...</p>
        ) : null}

        {!isLoading && errorMessage ? (
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
          <div className={styles.productsGrid}>
            {products.map((product, index) => (
              <ProductCard
                key={`${product.id}-${product.name}-${product.brand}-${index}`}
                productId={product.id}
                brand={product.brand}
                name={product.name}
                price={formatPrice(product.basePrice)}
                imageUrl={product.imageUrl}
                imageAlt={product.name}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default CatalogPage;
