import { useEffect, useState } from "react";
import ProductCard from "../../components/product-card/ProductCard.jsx";
import SearchBar from "../../components/search-bar/SearchBar.jsx";
import { getProducts } from "../../api/services/productsService.js";
import styles from "./CatalogPage.module.css";

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
};

const CatalogPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const result = await getProducts();

      if (!result.ok) {
        setErrorMessage(result.errorMessage);
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setProducts(result.products);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

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

        {!isLoading && !errorMessage ? (
          <div className={styles.productsGrid}>
            {products.map((product, index) => (
              <ProductCard
                key={`${product.id}-${product.name}-${product.brand}-${index}`}
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
