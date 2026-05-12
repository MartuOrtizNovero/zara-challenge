import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import imagePlaceholder from "../../assets/icons/image-placeholder.svg";

const ProductCard = ({ productId, brand, name, price, imageUrl, imageAlt }) => {
  return (
    <Link className={styles.cardLink} to={`/product/${productId}`}>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          {imageUrl ? (
            <img className={styles.image} src={imageUrl} alt={imageAlt} loading="lazy" />
          ) : (
            <img src={imagePlaceholder} alt="Product image not available" loading="lazy" />
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.brand}>{brand}</p>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.price}>{price}</p>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
