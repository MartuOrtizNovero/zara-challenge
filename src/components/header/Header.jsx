import { Link } from "react-router-dom";
import { useCart } from "../../context/cart/useCart.js";
import styles from "./Header.module.css";

const Header = () => {
  const { totalItems } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.logo} to="/">
          MBST
        </Link>

        <Link className={styles.cartLink} to="/cart" aria-label="Go to cart">
          <span className={styles.cartText}>CART</span>
          <span className={styles.cartCount}>{totalItems}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;