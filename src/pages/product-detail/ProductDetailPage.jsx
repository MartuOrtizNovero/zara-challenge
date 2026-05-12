import { useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import SimilarProductsCarousel from "../../components/similar-products-carousel/SimilarProductsCarousel.jsx";
import useProductDetail from "../../hooks/useProductDetail.js";
import { useCart } from "../../context/cart/useCart.js";
import { formatPrice } from "../../utils/formatPrice.js";
import styles from "./ProductDetailPage.module.css";
import imagePlaceholder from "../../assets/icons/image-placeholder.svg";

const createCartItemId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  const randomValues = new Uint32Array(4);
  window.crypto.getRandomValues(randomValues);

  return `cart-item-${Array.from(randomValues).join("-")}`;
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const [prevProductId, setPrevProductId] = useState(productId);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { canShowPageContent } = useOutletContext();
  const { product, isLoading, errorMessage } = useProductDetail(productId);

  if (prevProductId !== productId) {
    setPrevProductId(productId);
    setSelectedStorage(null);
    setSelectedColor(null);
  }

  if (isLoading || !canShowPageContent) {
    return <main className={styles.page} />;
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
  const hasSimilarProducts = product.similarProducts.length > 0;

  const handleAddToCart = () => {
    if (isAddToCartDisabled) {
      return;
    }

    const cartItem = {
      cartItemId: createCartItemId(),
      productId: product.id,
      brand: product.brand,
      name: product.name,
      price: currentPrice,
      imageUrl: currentImage,
      storage: selectedStorage.capacity,
      color: {
        name: selectedColor.name,
        hexCode: selectedColor.hexCode,
      },
    };

    addItemToCart(cartItem);
    navigate("/cart");
  };

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} to="/" aria-label="Back to catalog">
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
            <img src={imagePlaceholder} alt="Product image not available" />
          )}
        </div>

        <div className={styles.content}>
          <h1 className={styles.name}>{product.name}</h1>

          <p className={styles.price}>
            {selectedStorage
              ? formatPrice(currentPrice)
              : `From ${formatPrice(product.basePrice)}`}
          </p>

          <section className={styles.optionsSection}>
            <h2 className={styles.optionsTitle}>
              Storage. How much space do you need?
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
            <h2 className={styles.optionsTitle}>Color. Pick your favourite.</h2>

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

            {selectedColor && (
              <p className={styles.selectedColorName}>{selectedColor.name}</p>
            )}
          </section>

          <button
            type="button"
            className={styles.addToCartButton}
            disabled={isAddToCartDisabled}
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
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
      {hasSimilarProducts ? (
        <SimilarProductsCarousel
          products={product.similarProducts}
          formatPrice={formatPrice}
        />
      ) : null}
    </main>
  );
};

export default ProductDetailPage;
