import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/services/productsService.js";
import styles from "./ProductDetailPage.module.css";

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductDetailPage = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProductDetail = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const result = await getProductById(productId);

      if (!result.ok) {
        setProduct(null);
        setErrorMessage(result.errorMessage);
        setIsLoading(false);
        return;
      }

      setProduct(result.product);
      setIsLoading(false);
    };

    loadProductDetail();
  }, [productId]);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.feedbackMessage}>Loading product detail...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className={styles.page}>
        <p className={styles.errorMessage}>{errorMessage}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <p className={styles.feedbackMessage}>Product not found.</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.detailSection}>
        <div className={styles.imageContainer}>
          {product.imageUrl ? (
            <img
              className={styles.image}
              src={product.imageUrl}
              alt={product.name}
            />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true" />
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.brand}>{product.brand}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.basePrice)}</p>

          {product.description ? (
            <p className={styles.description}>{product.description}</p>
          ) : null}

          <section className={styles.specificationsSection}>
            <h2 className={styles.specificationsTitle}>Specifications</h2>

            <dl className={styles.specificationsList}>
              <div className={styles.specificationItem}>
                <dt>Screen</dt>
                <dd>{product.specs.screen || "-"}</dd>
              </div>

              <div className={styles.specificationItem}>
                <dt>Resolution</dt>
                <dd>{product.specs.resolution || "-"}</dd>
              </div>

              <div className={styles.specificationItem}>
                <dt>Processor</dt>
                <dd>{product.specs.processor || "-"}</dd>
              </div>

              <div className={styles.specificationItem}>
                <dt>Main camera</dt>
                <dd>{product.specs.mainCamera || "-"}</dd>
              </div>

              <div className={styles.specificationItem}>
                <dt>Selfie camera</dt>
                <dd>{product.specs.selfieCamera || "-"}</dd>
              </div>

              <div className={styles.specificationItem}>
                <dt>Battery</dt>
                <dd>{product.specs.battery || "-"}</dd>
              </div>

              <div className={styles.specificationItem}>
                <dt>OS</dt>
                <dd>{product.specs.os || "-"}</dd>
              </div>

              <div className={styles.specificationItem}>
                <dt>Refresh rate</dt>
                <dd>{product.specs.screenRefreshRate || "-"}</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
