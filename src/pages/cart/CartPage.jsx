import { Link } from "react-router-dom";
import { useCart } from "../../context/cart/useCart.js";
import styles from "./CartPage.module.css";

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
};

const CartPage = () => {
  const { cartItems, totalPrice, removeItemFromCart } = useCart();

  const hasItems = cartItems.length > 0;

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.title}>CART ({cartItems.length})</h1>

        {hasItems ? (
          <div className={styles.itemsList}>
            {cartItems.map((cartItem) => (
              <article key={cartItem.cartItemId} className={styles.cartItem}>
                <div className={styles.imageWrapper}>
                  <img
                    className={styles.image}
                    src={cartItem.imageUrl}
                    alt={cartItem.name}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <h2 className={styles.itemName}>{cartItem.name}</h2>

                  <p className={styles.itemVariant}>
                    {cartItem.storage} | {cartItem.color.name}
                  </p>

                  <p className={styles.itemPrice}>
                    {formatPrice(cartItem.price)}
                  </p>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeItemFromCart(cartItem.cartItemId)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <footer className={styles.footer}>
        <Link className={styles.continueShoppingLink} to="/">
          Continue shopping
        </Link>

        {hasItems ? (
          <div className={styles.summary}>
            <p className={styles.total}>
              <span className={styles.totalLabel}>TOTAL</span>
              <span className={styles.totalValue}>
                {formatPrice(totalPrice)}
              </span>
            </p>

            <button type="button" className={styles.payButton}>
              Pay
            </button>
          </div>
        ) : null}
      </footer>
    </main>
  );
};

export default CartPage;
