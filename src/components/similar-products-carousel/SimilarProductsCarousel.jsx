import PropTypes from "prop-types";
import ProductCard from "../product-card/ProductCard.jsx";
import styles from "./SimilarProductsCarousel.module.css";

const SimilarProductsCarousel = ({ products, formatPrice }) => {
  if (!products.length) {
    return null;
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="similar-products-title"
    >
      <h2 id="similar-products-title" className={styles.title}>
        Similar items
      </h2>

      <div
        className={styles.viewport}
        tabIndex={0}
        aria-label="Similar products carousel"
      >
        <div className={styles.track}>
          {products.map((product) => (
            <div key={product.listKey} className={styles.slide}>
              <ProductCard
                productId={product.id}
                brand={product.brand}
                name={product.name}
                price={formatPrice(product.basePrice)}
                imageUrl={product.imageUrl}
                imageAlt={product.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

SimilarProductsCarousel.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      listKey: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      brand: PropTypes.string,
      name: PropTypes.string.isRequired,
      basePrice: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
    }),
  ).isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default SimilarProductsCarousel;
