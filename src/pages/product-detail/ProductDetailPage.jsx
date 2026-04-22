import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProductDetail = async () => {
      setIsLoading(true);
      setErrorMessage("");
      setSelectedStorage(null);
      setSelectedColor(null);

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

  const currentImage = selectedColor?.imageUrl || product.imageUrl;
  const currentPrice = selectedStorage?.price || product.basePrice;
  const isAddToCartDisabled = !selectedStorage || !selectedColor;

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} to="/">
        &lt; Back
      </Link>

      <section className={styles.detailSection}>
        <div className={styles.imageContainer}>
          {currentImage ? (
            <img
              className={styles.image}
              src={currentImage}
              alt={product.name}
            />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true" />
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.brand}>{product.brand}</p>
          <h1 className={styles.name}>{product.name}</h1>

          <p className={styles.price}>
            {selectedStorage
              ? formatPrice(currentPrice)
              : `From ${formatPrice(product.basePrice)}`}
          </p>

          <section className={styles.optionsSection}>
            <h2 className={styles.optionsTitle}>
              Storage · How much space do you need?
            </h2>

            <div className={styles.storageOptions}>
              {product.storageOptions.map((storageOption) => {
                const isSelected =
                  selectedStorage?.capacity === storageOption.capacity;

                return (
                  <button
                    key={storageOption.capacity}
                    type="button"
                    className={`${styles.storageButton} ${
                      isSelected ? styles.storageButtonSelected : ""
                    }`}
                    onClick={() => setSelectedStorage(storageOption)}
                    aria-pressed={isSelected}
                  >
                    {storageOption.capacity}
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.optionsSection}>
            <h2 className={styles.optionsTitle}>
              Color · Pick your favourite.
            </h2>

            <div className={styles.colorOptions}>
              {product.colorOptions.map((colorOption) => {
                const isSelected = selectedColor?.name === colorOption.name;

                return (
                  <button
                    key={colorOption.name}
                    type="button"
                    className={`${styles.colorButton} ${
                      isSelected ? styles.colorButtonSelected : ""
                    }`}
                    style={{ backgroundColor: colorOption.hexCode }}
                    onClick={() => setSelectedColor(colorOption)}
                    aria-label={colorOption.name}
                    aria-pressed={isSelected}
                    title={colorOption.name}
                  />
                );
              })}
            </div>

            <p className={styles.selectedColorName}>
              {selectedColor ? selectedColor.name : "Select a color"}
            </p>
          </section>

          <button
            type="button"
            className={styles.addToCartButton}
            disabled={isAddToCartDisabled}
          >
            Add to cart
          </button>

          {product.description ? (
            <p className={styles.description}>{product.description}</p>
          ) : null}
        </div>
      </section>

      <section className={styles.specificationsSection}>
        <h2 className={styles.specificationsTitle}>Specifications</h2>

        <dl className={styles.specificationsList}>
          <div className={styles.specificationItem}>
            <dt>Brand</dt>
            <dd>{product.brand || "-"}</dd>
          </div>

          <div className={styles.specificationItem}>
            <dt>Name</dt>
            <dd>{product.name || "-"}</dd>
          </div>

          <div className={styles.specificationItem}>
            <dt>Description</dt>
            <dd>{product.description || "-"}</dd>
          </div>

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
            <dt>Screen refresh rate</dt>
            <dd>{product.specs.screenRefreshRate || "-"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
};

export default ProductDetailPage;
