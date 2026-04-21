import styles from "./ProductCard.module.css";

const ProductCard = ({ brand, name, price, imageUrl, imageAlt }) => {
  return (
    <article className={styles.card}>
      {imageUrl ? (
        <img className={styles.image} src={imageUrl} alt={imageAlt} />
      ) : (
        <div className={styles.imagePlaceholder} aria-hidden="true" />
      )}

      <div className={styles.info}>
        <p className={styles.brand}>{brand}</p>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.price}>{price}</p>
      </div>
    </article>
  );
};

export default ProductCard;
